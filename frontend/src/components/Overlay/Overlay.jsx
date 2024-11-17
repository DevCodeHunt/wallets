const Overlay = (props) => {
  const {opacity = "0.7"} = props
  return (
    <div id="overlay" style={{position: "relative", textAlign: "center", zIndex: 9999999}}>
      <img
        style={{
          zIndex: 9999,
          position: "fixed",
          top: "40%",
          color: "#4f657b",
          right: "44%",
        }}
        src="/loading.gif"
      />
      <div
        style={{
          textAlign: "center",
          position: "fixed",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          background: "#fff",
          height: "100%",
          zIndex: 1001,
          opacity: opacity,
        }}
      />
    </div>
  )
}
export default Overlay
