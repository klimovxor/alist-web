import { Box } from "@hope-ui/solid"
import { onMount, onCleanup } from "solid-js"

interface LoginBgProps {
  useNewVersion?: boolean
}

const LoginBg = (props: LoginBgProps) => {
  let boxRef!: HTMLDivElement
  let canvasRef!: HTMLCanvasElement
  let animationId: number
  let rainDrops: number[] = []

  const alphabet =
    "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "0123456789" +
    "!#$%&()*+,-./:;<=>?@[]^_|}~"

  const fontSize = 16

  // НАСТРОЙКА СКОРОСТИ: количество кадров в секунду
  // 60 - стандартно (очень быстро)
  // 20-30 - оптимально для классической "Матрицы"
  const FPS = 25
  const interval = 1000 / FPS

  const initMatrix = () => {
    const canvas = canvasRef
    const box = boxRef
    const dpr = window.devicePixelRatio || 1
    canvas.width = box.clientWidth * dpr
    canvas.height = box.clientHeight * dpr
    canvas.style.width = box.clientWidth + "px"
    canvas.style.height = box.clientHeight + "px"
    const ctx = canvas.getContext("2d")!
    ctx.scale(dpr, dpr)

    const columns = Math.floor(box.clientWidth / fontSize)
    rainDrops = new Array(columns).fill(1)

    let lastDrawTime = performance.now()

    const draw = (currentTime: number) => {
      // Запрашиваем следующий кадр в любом случае
      animationId = requestAnimationFrame(draw)

      // Вычисляем, сколько времени прошло с последней отрисовки
      const deltaTime = currentTime - lastDrawTime

      // Отрисовываем кадр только если прошло достаточно времени
      if (deltaTime > interval) {
        // Выравниваем время, чтобы избежать подергиваний анимации
        lastDrawTime = currentTime - (deltaTime % interval)

        ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
        ctx.fillRect(0, 0, box.clientWidth, box.clientHeight)
        ctx.fillStyle = "#0f0"
        ctx.font = fontSize + "px monospace"

        for (let i = 0; i < rainDrops.length; i++) {
          const text = alphabet.charAt(
            Math.floor(Math.random() * alphabet.length),
          )

          // Math.round больше не нужен, так как rainDrops всегда целое число
          ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize)

          if (
            rainDrops[i] * fontSize > box.clientHeight &&
            Math.random() > 0.975
          ) {
            rainDrops[i] = 0
          }
          // Оставляем шаг 1.0 для максимальной резкости пикселей
          rainDrops[i] += 1.0
        }
      }
    }

    // Запускаем цикл
    animationId = requestAnimationFrame(draw)
  }

  const handleResize = () => {
    if (!canvasRef || !boxRef) return
    const canvas = canvasRef
    const box = boxRef
    const dpr = window.devicePixelRatio || 1
    canvas.width = box.clientWidth * dpr
    canvas.height = box.clientHeight * dpr
    canvas.style.width = box.clientWidth + "px"
    canvas.style.height = box.clientHeight + "px"
    const ctx = canvas.getContext("2d")!
    ctx.scale(dpr, dpr)
    const columns = Math.floor(box.clientWidth / fontSize)
    rainDrops = new Array(columns).fill(1)
  }

  onMount(() => {
    initMatrix()
    window.addEventListener("resize", handleResize)
    onCleanup(() => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    })
  })

  return (
    <Box
      ref={boxRef}
      pos="fixed"
      top="0"
      left="0"
      overflow="hidden"
      zIndex="-1"
      w="100vw"
      h="100vh"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          opacity: 0.15,
        }}
      />
    </Box>
  )
}

export default LoginBg
