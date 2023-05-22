import { MeshProps } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { IcosahedronGeometry } from "three"

import fragmentShader from "./shaders/fragment.glsl"
import vertexShader from "./shaders/vertex.glsl"

interface ShaderProps {
  speed: number
  color: number
  offset: number
}

export enum SizeChoice {
  Small = "Small",
  Medium = "Medium",
}

const BlobSizes: Record<SizeChoice, number> = {
  [SizeChoice.Small]: 0.8,
  [SizeChoice.Medium]: 5,
}

const IcosahedronGeos: Record<string, IcosahedronGeometry> = Object.fromEntries(
  Object.entries(BlobSizes).map(([sizeChoice, size]) => [
    sizeChoice as SizeChoice,
    new IcosahedronGeometry(size, 8),
  ]),
)

const LowResIcosahedronGeos: Record<string, IcosahedronGeometry> =
  Object.fromEntries(
    Object.entries(BlobSizes).map(([sizeChoice, size]) => [
      sizeChoice as SizeChoice,
      new IcosahedronGeometry(size, 1),
    ]),
  )

interface BlobProps extends ShaderProps {
  sizeType: SizeChoice
  lowRes?: boolean
  meshProps?: MeshProps
}

export function BlobShaderMaterial({ speed, color, offset }: ShaderProps) {
  const ref = useRef()
  const data = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uHue: { value: 1 },
        uSpeed: { value: speed },
        uNoiseDensity: { value: 0.5 },
        uNoiseStrength: { value: 0.03 },
        uOffset: { value: offset },
        uFreq: { value: 0 },
        uAmp: { value: 0 },
        red: { value: 255 },
        green: { value: 255 },
        blue: { value: 255 },
        uAlpha: { value: 0.6 },
      },
      defines: {
        PI: Math.PI,
      },
      fragmentShader,
      vertexShader,
    }),
    [color, speed, offset],
  )

  return (
    <shaderMaterial
      key={[color, speed, offset].join(" ")}
      ref={ref}
      attach="material"
      {...data}
      precision="lowp"
    />
  )
}

export default function Blob({
  sizeType,
  meshProps = {},
  lowRes,
  ...shaderProps
}: BlobProps) {
  return (
    <mesh
      {...meshProps}
      geometry={
        lowRes ? LowResIcosahedronGeos[sizeType] : IcosahedronGeos[sizeType]
      }
    >
      <BlobShaderMaterial {...shaderProps} />
    </mesh>
  )
}
