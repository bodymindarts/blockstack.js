/* @flow */
import { Service } from './service'
import cheerio from 'cheerio'

class HackerNews extends Service {
  static getBaseUrls() {
    const baseUrls = ['https://news.ycombinator.com/user?id=']
    return baseUrls
  }

  static getProofUrl(proof: { proof_url: string, identifier: string, service: string }) {
    const baseUrls = this.getBaseUrls()
    for (let i = 0; i < baseUrls.length; i++) {
      if (proof.proof_url === `${baseUrls[i]}${proof.identifier}`) {
        return proof.proof_url
      }
    }
    throw new Error(`Proof url ${proof.proof_url} is not valid for service ${proof.service}`)
  }

  static getProofStatement(searchText: string) {
    const $ = cheerio.load(searchText)
    const tables = $('#hnmain').children().find('table')
    let statement = ''

    if (tables.length > 0) {
      tables.each((tableIndex, table) => {
        const rows = $(table).find('tr')

        if (rows.length > 0) {
          rows.each((idx, row) => {
            const heading = $(row).find('td')
                                  .first()
                                  .text()
                                  .trim()

            if (heading === 'about:') {
              statement = $(row).find('td')
                                .last()
                                .text()
                                .trim()
            }
          })
        }
      })
    } 

    return statement
  }
}

export { HackerNews }
