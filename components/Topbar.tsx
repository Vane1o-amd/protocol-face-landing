import { CTA_PRIMARY } from "@/components/cta-strings";

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="wrap">
        <a href="#top" className="logo">
          <span className="dot" />
          MenFace
        </a>
        <a href="#apply" className="nav-cta">
          {CTA_PRIMARY}
        </a>
      </div>
    </header>
  );
}