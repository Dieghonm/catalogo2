import { createContext, useContext, useState, useEffect, useRef } from 'react'
import * as XLSX from 'xlsx'

const DataContext = createContext(null)

export const DataProvider = ({ children }) => {

  const [listaFabricas, setListaFabricas] = useState([])
  const [fabricasData, setFabricasData] = useState({})
  const [categorias, setCategorias] = useState([])

  const carregou = useRef(false)

  useEffect(() => {
    if (carregou.current) return
    carregou.current = true
    carregarFabricas()
  }, [])

  async function carregarFabricas() {
    try {
      const response = await fetch('fabricas.json')
      if (!response.ok) return
      const fabricas = await response.json()
      setListaFabricas(fabricas)

      await carregarTodosXlsx(fabricas)
    } catch (error) {
      console.log('Erro ao carregar fabricas:', error)
    }
  }

  async function carregarTodosXlsx(fabricas) {
    const resultado = {}
    const todasCategorias = new Set()

    await Promise.all(
      fabricas.map(async fabrica => {
        resultado[fabrica.id] = {}
        await Promise.all(
          fabrica.arquivos.map(async arquivo => {

            try {
              const response = await fetch(`${import.meta.env.BASE_URL}data/fabricas/${arquivo}`)
              if (!response.ok) return
              const buffer = await response.arrayBuffer()
              const workbook = XLSX.read(buffer, { type: 'array' })
              const sheet = workbook.Sheets[workbook.SheetNames[0]]
              const linhas = XLSX.utils.sheet_to_json(sheet, { header: 1 })
              const linhasFiltradas = linhas.filter(l => Array.isArray(l) && l.length >= 2)
              const cabecalho = linhasFiltradas[0] ?? []
              const indiceCategoria = cabecalho.findIndex(col =>
                typeof col === 'string' && /categoria|tipo|classe/i.test(col.trim())
              )

              if (indiceCategoria >= 0) {
                linhasFiltradas.slice(1).forEach(linha => {
                  const valor = linha[indiceCategoria]
                  if (valor) todasCategorias.add(String(valor).trim())
                })
              }
              resultado[fabrica.id][arquivo] = linhasFiltradas
            } catch (error) {
              console.log(`Erro ao carregar ${arquivo}:`, error)
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