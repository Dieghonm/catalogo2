import { createContext, useContext, useState, useEffect, useRef } from 'react'

const DataContext = createContext(null)

// ── Converte uma linha do XLSX em objeto de produto ──────────
function linhaParaProduto(cabecalho, linha, fabricaId, destaques) {
  const get = (nomeCol) => {
    const idx = cabecalho.findIndex(c =>
      typeof c === 'string' && c.trim().toLowerCase() === nomeCol.toLowerCase()
    )
    return idx >= 0 ? linha[idx] ?? '' : ''
  }

  const referencia = String(get('Referência') ?? '').trim()
  if (!referencia) return null

  // Imagens: pega todas as colunas "Imagem 1", "Imagem 2", ...
  const imagens = cabecalho
    .map((col, i) => ({ col: String(col ?? '').trim(), val: linha[i] }))
    .filter(({ col }) => /^imagem\s*\d+$/i.test(col))
    .map(({ val }) => String(val ?? '').trim())
    .filter(Boolean)

  // Descrição base
  const descricaoBase = String(get('Descrição') ?? '').trim()

  // Colunas de descrição extra: "Descrição 2", "Descrição 3", ...
  const descExtra = cabecalho
    .map((col, i) => ({ col: String(col ?? '').trim(), val: linha[i] }))
    .filter(({ col }) => /^descri[cç][aã]o\s+\d+$/i.test(col))
    .filter(({ val }) => val !== undefined && String(val).trim() !== '')
    .map(({ col, val }) => `${col}: ${String(val).trim()}`)

  const descricao = [descricaoBase, ...descExtra].filter(Boolean).join('\n')

  const precoRaw = get('Preço Unit. (R$)')
  const preco    = typeof precoRaw === 'number' ? precoRaw : parseFloat(String(precoRaw).replace(',', '.')) || 0

  const cxRaw   = get('Cx Mestre (un)')
  const cxMestre = typeof cxRaw === 'number' ? cxRaw : parseInt(String(cxRaw)) || 1

  const destaque = destaques.some(
    d => d.fabricaId === fabricaId && String(d.referencia) === referencia
  )

  return {
    fabricaId,
    referencia,
    nome:      String(get('Nome do Produto') ?? '').trim(),
    cxMestre,
    preco,
    categoria: String(get('Categoria') ?? '').trim(),
    colecao:   String(get('Coleção') ?? '').trim(),
    tamanho:   String(get('Tamanho') ?? '').trim(),
    descricao,
    imagem:    imagens[0] ?? '',
    imagens,
    destaque,
  }
}

// ── Context ─────────────────────────────────────────────────

export const DataProvider = ({ children }) => {
  const [listaFabricas, setListaFabricas] = useState([])
  const [fabricasData, setFabricasData]   = useState({})   // dados crus (array de arrays)
  const [TODOS_PRODUTOS, setTodosProdutos] = useState([])
  const [categorias, setCategorias]        = useState([])
  const [destaques, setDestaques]          = useState([])

  const carregou = useRef(false)

  useEffect(() => {
    if (carregou.current) return
    carregou.current = true
    init()
  }, [])

  async function init() {
    // Carrega destaques e fábricas em paralelo
    const [fabricas, dests] = await Promise.all([
      fetch(`${import.meta.env.BASE_URL}fabricas.json`).then(r => r.ok ? r.json() : []),
      fetch(`${import.meta.env.BASE_URL}destaques.json`).then(r => r.ok ? r.json() : []),
    ])
    setListaFabricas(fabricas)
    setDestaques(dests)
    await carregarTodosJson(fabricas, dests)
  }

  async function carregarTodosJson(fabricas, dests) {
    const resultado      = {}
    const todosProdutos  = []
    const todasCategorias = new Set()

    await Promise.all(
      fabricas.map(async fabrica => {
        resultado[fabrica.id] = {}

        await Promise.all(
          fabrica.arquivos.map(async arquivo => {
            const nomeJson = arquivo.replace(/\.xlsx$/i, '.json')
            const url      = `${import.meta.env.BASE_URL}json/${nomeJson}`

            try {
              const res = await fetch(url)
              if (!res.ok) { console.warn(`Não encontrado: ${url}`); return }

              const linhas          = await res.json()
              const linhasFiltradas = linhas.filter(l => Array.isArray(l) && l.length >= 2)
              if (linhasFiltradas.length < 2) return

              const cabecalho = linhasFiltradas[0]

              // Converte cada linha em produto
              linhasFiltradas.slice(1).forEach(linha => {
                const prod = linhaParaProduto(cabecalho, linha, fabrica.id, dests)
                if (!prod) return
                todosProdutos.push(prod)
                if (prod.categoria) todasCategorias.add(prod.categoria)
              })

              resultado[fabrica.id][arquivo] = linhasFiltradas
            } catch (err) {
              console.error(`Erro ao carregar ${nomeJson}:`, err)
            }
          })
        )
      })
    )

    setFabricasData(resultado)
    setTodosProdutos(todosProdutos)
    setCategorias([...todasCategorias].sort())
  }

  // Retorna objeto { ...fabrica, produtos: [] } ou null
  function getFabrica(fabricaId) {
    const fab = listaFabricas.find(f => f.id === fabricaId)
    if (!fab) return null
    return {
      ...fab,
      produtos: TODOS_PRODUTOS.filter(p => p.fabricaId === fabricaId),
    }
  }

  // Lista de fábricas com campo "nome" para o Filtros
  const FABRICAS = listaFabricas

  function contarPorCategoria(cat) {
    return TODOS_PRODUTOS.filter(p => p.categoria === cat).length
  }

  return (
    <DataContext.Provider value={{
      listaFabricas,
      fabricasData,
      TODOS_PRODUTOS,
      FABRICAS,
      categorias,
      getFabrica,
      contarPorCategoria,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)