import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from "fs"
import path from "path"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const XLSX = require("xlsx")

const pastaXlsx = "./public/fabricas"
const pastaJson = "./public/json"

if (!existsSync(pastaJson)) {
  mkdirSync(pastaJson, { recursive: true })
}

const arquivos = readdirSync(pastaXlsx)

for (const arquivo of arquivos) {
  if (!arquivo.endsWith(".xlsx")) continue

  const caminho = path.join(pastaXlsx, arquivo)
  const workbook = XLSX.readFile(caminho)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]

  const dados = XLSX.utils.sheet_to_json(sheet, { header: 1 })
  const dadosFiltrados = dados.filter(l => Array.isArray(l) && l.length >= 2)

  const nome = arquivo.replace(".xlsx", ".json")
  writeFileSync(
    path.join(pastaJson, nome),
    JSON.stringify(dadosFiltrados)
  )

  console.log("✅ convertido:", nome, `(${dadosFiltrados.length} linhas)`)
}

console.log("🎉 Conversão concluída!")