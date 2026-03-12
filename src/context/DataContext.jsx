import { createContext, useContext, useState, useEffect, useRef } from 'react'

const DataContext = createContext(null)

export const DataProvider = ({ children }) => {
  const [listaFabricas, setListaFabricas] = useState([])
  const [fabricasData, setFabricasData]   = useState({})
  const [categorias, setCategorias]       = useState([])

  const carregou = useRef(false)

  useEffect(() => {
    if (carregou.current) return
    carregou.current = true
    carregarFabricas()
  }, [])

  async function carregarFabricas() {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}fabricas.json`)
      if (!res.ok) return
      const fabricas = await res.json()
      setListaFabricas(fabricas)
      await carregarTodosJson(fabricas)
    } catch (err) {
      console.error('Erro ao carregar fabricas.json:', err)
    }
  }

  async function carregarTodosJson(fabricas) {
    const resultado       = {}
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
              if (!res.ok) {
                console.warn(`JSON não encontrado: ${url}`)
                return
              }

              const linhas          = await res.json()
              const linhasFiltradas = linhas.filter(l => Array.isArray(l) && l.length >= 2)

              const cabecalho = linhasFiltradas[0] ?? []
              const idxCat    = cabecalho.findIndex(col =>
                typeof col === 'string' && /categoria|tipo|classe/i.test(col.trim())
              )
              if (idxCat >= 0) {
                linhasFiltradas.slice(1).forEach(linha => {
                  const val = linha[idxCat]
                  if (val) todasCategorias.add(String(val).trim())
                })
              }

              resultado[fabrica.id][arquivo] = linhasFiltradas
            } catch (err) {
              console.error(`Erro ao carregar ${nomeJson}:`, err)
            }
          })
        )
      })
    )

    setFabricasData(resultado)
    setCategorias([...todasCategorias].sort())
  }

  return (
    <DataContext.Provider value={{ listaFabricas, fabricasData, categorias }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)