import fs from "fs"
import path from "path"
import * as XLSX from "xlsx"

const pastaXlsx = "./public/xlsx"
const pastaJson = "./public/fabricas"

// Cria pasta de destino se não existir
if (!fs.existsSync(pastaJson)) {
  fs.mkdirSync(pastaJson, { recursive: true })
}

const arquivos = fs.readdirSync(pastaXlsx)

for (const arquivo of arquivos) {
  if (!arquivo.endsWith(".xlsx")) continue

  const caminho = path.join(pastaXlsx, arquivo)
  const workbook = XLSX.readFile(caminho)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]

  // header:1 mantém o mesmo formato que o DataContext já espera (array de arrays)
  const dados = XLSX.utils.sheet_to_json(sheet, { header: 1 })

  // Filtra linhas vazias (mesma lógica do DataContext)
  const dadosFiltrados = dados.filter(l => Array.isArray(l) && l.length >= 2)

  const nome = arquivo.replace(".xlsx", ".json")
  fs.writeFileSync(
    path.join(pastaJson, nome),
    JSON.stringify(dadosFiltrados)
  )

  console.log("✅ convertido:", nome, `(${dadosFiltrados.length} linhas)`)
}

console.log("🎉 Conversão concluída!")