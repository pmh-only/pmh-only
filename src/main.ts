import 'dotenv/config'
import './fetcher/implements'
import './renderer/implements'

import { RendererRegistrar } from './renderer/RendererRegistrar'

async function main (): Promise<void> {
  await RendererRegistrar
    .getInstance()
    .renderAll()
}

void main()
