import { Link } from 'react-router-dom'
import { useData } from '../context'

const LOGO = 'https://res.cloudinary.com/dfkebb4ds/image/upload/v1773094598/Captura_de_tela_de_2026-03-09_19-11-03_agakbo.png'

export default function Home() {
  const { listaFabricas, TODOS_PRODUTOS, categorias, contarPorCategoria, getFabrica } = useData()

  return (
    <div className="page-home">

      {/* ── HERO ───────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-logo-side">
          <img src={LOGO} alt="Logo" className="hero-logo" />
        </div>
        <div className="hero-text">
          <p className="hero-sub">Bem-vindo ao nosso catálogo</p>
          <div className="hero-stats">
            <div><strong>{TODOS_PRODUTOS.length}</strong><span>Produtos</span></div>
            <div><strong>{listaFabricas.length}</strong><span>Fábricas</span></div>
          </div>
        </div>
      </section>

      {/* ── FÁBRICAS ───────────────────────────────────── */}
      <section className="fabricas-section">
        <div className="section-header">
          <h2>Nossas Fábricas</h2>
          <p>Clique em uma fábrica para ver seu catálogo completo</p>
        </div>
        <div className="fabricas-grid">
          {listaFabricas.map(fab => {
            const qtdProdutos = TODOS_PRODUTOS.filter(p => p.fabricaId === fab.id).length
            return (
              <Link
                key={fab.id}
                to={`/fabrica/${fab.id}`}
                className="fabrica-card"
                style={{ '--fab-cor': fab.cor }}
              >
                <div className="fabrica-logo-wrap">
                  <img src={fab.logo} alt={fab.nome} className="fabrica-logo-img" />
                </div>
                <div className="fabrica-info">
                  <h3>{fab.nome}</h3>
                  <span>{qtdProdutos} produto{qtdProdutos !== 1 ? 's' : ''}</span>
                </div>
                <div className="fabrica-arrow">→</div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── CATEGORIAS ─────────────────────────────────── */}
      {categorias.length > 0 && (
        <section className="categorias-section">
          <div className="section-header">
            <h2>Categorias</h2>
            <p>Explore os produtos por tipo</p>
          </div>
          <div className="categorias-grid">
            {categorias.map(cat => {
              const count = contarPorCategoria(cat)
              return (
                <Link
                  key={cat}
                  to={`/catalogo?categoria=${encodeURIComponent(cat)}`}
                  className="categoria-card"
                >
                  <span className="categoria-nome">{cat}</span>
                  <span className="categoria-count">{count} produto{count !== 1 ? 's' : ''}</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="cta-catalogo">
        <p>Ou prefere navegar por tudo de uma vez?</p>
        <Link to="/catalogo" className="btn-catalogo-geral">
          Ver catálogo completo
        </Link>
      </section>

    </div>
  )
}