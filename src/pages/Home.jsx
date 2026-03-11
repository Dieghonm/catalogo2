export default function Home() {
return (<>HOME</>)}
// import { Link } from 'react-router-dom'
// import { useData } from '../context/DataContext'

// const LOGO = 'https://res.cloudinary.com/dfkebb4ds/image/upload/v1773094598/Captura_de_tela_de_2026-03-09_19-11-03_agakbo.png'

// export default function Home() {
//   const { listaFabricas, fabricasData } = useData()

//   // Conta total de produtos somando todas as linhas de todos os xlsx (menos o cabeçalho)
//   const totalProdutos = listaFabricas.reduce((acc, fab) => {
//     const arquivos = fabricasData[fab.id] ?? {}
//     const linhas = Object.values(arquivos).reduce((s, rows) => s + Math.max(0, (rows as any[][]).length - 1), 0)
//     return acc + linhas
//   }, 0)

//   return (
//     <div className="page-home">

//       {/* ── HERO ───────────────────────────────────────── */}
//       {/* <section className="hero">
//         <div className="hero-logo-side">
//           <img src={LOGO} alt="Logo" className="hero-logo" />
//         </div>
//         <div className="hero-text">
//           <p className="hero-sub">Bem-vindo ao nosso catálogo</p>
//           <div className="hero-stats">
//             <div><strong>{totalProdutos}</strong><span>Produtos</span></div>
//             <div><strong>{listaFabricas.length}</strong><span>Fábricas</span></div>
//           </div>
//         </div>
//       </section> */}

//       {/* ── FÁBRICAS ───────────────────────────────────── */}

//       {/* <section className="fabricas-section">
//         <div className="section-header">
//           <h2>Nossas Fábricas</h2>
//           <p>Clique em uma fábrica para ver seu catálogo completo</p>
//         </div>
//         <div className="fabricas-grid">
//           {listaFabricas.map(fab => {
//             const arquivos = fabricasData[fab.id] ?? {}
//             const qtdProdutos = Object.values(arquivos).reduce((s, rows) => s + Math.max(0, (rows as any[][]).length - 1), 0)

//             return (
//               <Link
//                 key={fab.id}
//                 to={`/fabrica/${fab.id}`}
//                 className="fabrica-card"
//                 style={{ '--fab-cor': fab.cor } as React.CSSProperties}
//               >
//                 <div className="fabrica-logo-wrap">
//                   <img src={fab.logo} alt={fab.nome} className="fabrica-logo-img" />
//                 </div>
//                 <div className="fabrica-info">
//                   <h3>{fab.nome}</h3>
//                   <span>{qtdProdutos} produto{qtdProdutos !== 1 ? 's' : ''}</span>
//                 </div>
//                 <div className="fabrica-arrow">→</div>
//               </Link>
//             )
//           })}
//         </div>
//       </section> */}
//     </div>
//   )
// }





      // {/* ── CATEGORIAS ─────────────────────────────────── */}
      // {/* <section className="categorias-section">
      //   <div className="section-header">
      //     <h2>Categorias</h2>
      //     <p>Explore os produtos por tipo</p>
      //   </div>
      //   <div className="categorias-grid">
      //     {categorias.map(cat => {
      //       const count = TODOS_PRODUTOS.filter(p => p.categoria === cat).length
      //       return (
      //         <Link
      //           key={cat}
      //           to={`/catalogo?categoria=${encodeURIComponent(cat)}`}
      //           className="categoria-card"
      //         >
      //           <span className="categoria-nome">{cat}</span>
      //           <span className="categoria-count">{count} produto{count !== 1 ? 's' : ''}</span>
      //         </Link>
      //       )
      //     })}
      //   </div>
      // </section> */}

      // {/* ── CTA ────────────────────────────────────────── */}
      // {/* <section className="cta-catalogo">
      //   <p>Ou prefere navegar por tudo de uma vez?</p>
      //   <Link to="/catalogo" className="btn-catalogo-geral">
      //     Ver catálogo completo
      //   </Link>
      // </section> */}