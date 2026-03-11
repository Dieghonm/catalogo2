import { createContext, useContext, useState, useEffect } from 'react'
import * as XLSX from 'xlsx'

const DataContext = createContext(null)

export const DataProvider = ({ children }) => {

  const [listaFabricas, setListaFabricas] = useState([])
  const [fabricasData, setFabricasData] = useState({})

  useEffect(() => {
    carregarFabricas()
  }, [])

  async function carregarFabricas() {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/fabricas.json`)
      if (!response.ok) return
      const data = await response.json()
      setListaFabricas(data)
      console.log("Fabricas carregadas:", data)

      // Após carregar o JSON, carrega os xlsx de cada fábrica
      // await carregarTodosXlsx(data)
    } catch (error) {
      console.log("Erro ao carregar fabricas:", error)
    }
  }

  async function carregarTodosXlsx(fabricas) {
    const resultado = {}

    for (const fabrica of fabricas) {
      resultado[fabrica.id] = {}

      for (const arquivo of fabrica.arquivos) {
        try {
          const response = await fetch(`${import.meta.env.BASE_URL}data/fabricas/${arquivo}`)
          if (!response.ok) continue

          const buffer = await response.arrayBuffer()
          const workbook = XLSX.read(buffer, { type: 'array' })
          const primeiraAba = workbook.SheetNames[0]
          const sheet = workbook.Sheets[primeiraAba]
          const linhas = XLSX.utils.sheet_to_json(sheet, { header: 1 })

          resultado[fabrica.id][arquivo] = linhas
          console.log(`[${fabrica.id}/${arquivo}] primeira linha:`, linhas[0])
        } catch (error) {
          console.log(`Erro ao carregar ${arquivo}:`, error)
        }
      }
    }

    setFabricasData(resultado)
    console.log("Todos os xlsx carregados:", resultado)
  }

  return (
    <DataContext.Provider value={{ listaFabricas, setListaFabricas, fabricasData }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)