import "./Hero.css"

export default function Hero() {
  return (
    <div className="hero fadeInDown flex flex-col items-center justify-center mt-36">
      <h1 className="text-3xl text-center md:text-8xl m-0">Electric Tree</h1>
      <h2
        className="text-5xl text-center md:text-5xl py-4 max-w-3xl"
        style={{ fontWeight: 700 }}
      >
        Igniting Climate Innovation
      </h2>
    </div>
  )
}
