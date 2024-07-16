import { mkdir } from 'fs/promises'
import { FetcherRegistrar } from '../../fetcher/FetcherRegistrar'
import { Renderer } from '../Renderer'
import { RendererRegistrar } from '../RendererRegistrar'
import joinImages from 'join-images'
import sharp from 'sharp'

export class FriendsRenderer implements Renderer {
  public readonly render = async (): Promise<void> => {
    const data = await FetcherRegistrar
      .getInstance()
      .requestData()

    await mkdir('./tmp')
      .catch(() => {})

    const downloadJobs = []
    const profileImages = [] as Buffer[]

    for (const friend of data.friends as string[]) {
      downloadJobs.push((async () => {
        const image = await fetch('https://avatars.githubusercontent.com/u/' + friend)
        const imageByte = await image.arrayBuffer()

        const imageResized = await sharp(imageByte)
          .resize(100, 100)
          .toBuffer()

        profileImages.push(imageResized)
      })())
    }

    await Promise.all(downloadJobs)

    const profileMatrix = [] as Buffer[][]
    profileImages.forEach((v, i) => {
      const rowIndex = Math.floor(i / 12)

      if (profileMatrix[rowIndex] === undefined) {
        profileMatrix[rowIndex] = []
      }

      profileMatrix[rowIndex].push(v)
    })

    const joinedProfileRow = [] as Buffer[]
    for (const profileRow of profileMatrix) {
      const joinedProfile = await joinImages(profileRow, {
        direction: 'horizontal',
        color: '#ffffff00'
      })
      joinedProfileRow.push(await joinedProfile.png().toBuffer())
    }

    const joinedProfileImage = await joinImages(joinedProfileRow, {
      color: '#ffffff00'
    })
    const compositedImage = await joinedProfileImage
      .png()
      .toBuffer()

    const affinedImage = await sharp(compositedImage)
      .affine([[1, 0.05], [0.05, 1]], { background: '#ffffff00' })
      .resize(2200)
      .toBuffer()

    await sharp(affinedImage)
      .extract({ left: 50, top: 160, width: 2100, height: 800 })
      .toFile('./friends.png')
  }
}

RendererRegistrar
  .getInstance()
  .register(new FriendsRenderer())
