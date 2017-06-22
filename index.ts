import * as child_process from "child_process"

import * as async from "async"
import * as Promise from "bluebird"


interface IinputCam {
    uri: string
    address: string
}
interface Icam extends IinputCam {
    process: any
    number: number
}

interface IinputAudio {
    volume: number
    device: string
    channel: string
}
interface IAudio extends IinputAudio {
    process: any
    number: number
}
export class Recorder {
    cams: Icam[]
    storefolder: string
    audioSources: IAudio[]
    constructor(options: { cams: IinputCam[], audioSources: IinputAudio[], storefolder: string }) {
        const that = this
        options.cams.forEach((c, i) => {
            that.cams.push({ uri: c.uri, address: c.address, process: false, number: i })
        })
        options.audioSources.forEach((a, i) => {
            that.audioSources.push({ volume: a.volume, device: a.device, channel: a.channel, process: false, number: i })
        })
    }

    recordVideo() {
        const that = this

        setInterval(() => {

            async.eachSeries(that.cams, (cam, cb) => {

                if (cam.process) {
                    cb()
                } else {
                    cam.process = child_process.spawn("ffmpeg", ['-i', cam.uri, '-vcodec', 'copy', '-f', 'mp4', that.storefolder + '/cam' + cam.number + '_' + Date.now() + '.mp4'], { detached: true, stdio: "ignore" })
                    cam.process.on("exit", () => {
                        cam.process = false
                    })
                    cb()
                }


            }, (error) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('recording is ok')
                }
            })


        }, 5000)



    }

    recordAudio() {
        const that = this

        setInterval(() => {

            async.eachSeries(that.audioSources, (asource, cb) => {

                if (asource.process) {
                    cb()
                } else {
                    asource.process = child_process.spawn("ffmpeg", ['-i', 'alsa', '-acodec', 'copy', '-f', 'aac', that.storefolder + '/audio' + asource.number + '_' + Date.now() + '.aac'], { detached: true, stdio: "ignore" })
                    asource.process.on("exit", () => {
                        asource.process = false
                    })
                    cb()
                }


            }, (error) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('recording is ok')
                }
            })


        }, 5000)



    }


}