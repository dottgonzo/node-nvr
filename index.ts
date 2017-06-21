import * as child_process from "child_process"

import * as async from "async"
import * as Promise from "bluebird"


interface IinputCam {
    uri: string
}
interface Icam extends IinputCam {
    process: any
}

export class Recorder {
    cams: Icam[]
    constructor(options: { cams: IinputCam[] }) {
        const that = this
        for (let c of options.cams) {
            that.cams.push({ uri: c.uri, process: false })
        }
    }

    record() {
        const that = this

        setInterval(() => {

            async.eachSeries(that.cams, (cam, cb) => {

                if (cam.process) {
                    cb()
                } else {
                    child_process.spawn("rtmpdump", options, { detached: true, stdio: "ignore" })
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