import Link from 'next/link'
import { Wave } from '../interfaces'

type WaveProps = {
    wave: Wave
}

export default function WaveComponent({ wave }: WaveProps) {
    return (
        <Link href="/wave/[id]" as={`/wave/${wave.id}`}>
            {wave.name}
        </Link>
    )
}
