import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FinalScene } from './components/FinalScene'
import { Hero } from './components/Hero'
import { MapScene } from './components/MapScene'
import { Nav } from './components/Nav'
import { Scene } from './components/Scene'
import { scenes } from './story'

export function App() {
  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <Nav />
      <main>
        <Hero />
        {scenes.map((scene) => <Scene key={scene.id} scene={scene} />)}
        <MapScene />
      </main>
      <FinalScene />
    </>
  )
}
