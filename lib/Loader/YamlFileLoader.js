import FileLoader from './FileLoader'
import yaml from 'js-yaml'
import * as fs from 'fs/promises'
import * as fsSync from 'fs'
import ServiceFileNotFoundException from '../Exception/ServiceFileNotFoundException'
import ServiceFileNotLoadedException from '../Exception/ServiceFileNotLoadedException'

export default class YamlFileLoader extends FileLoader {
  /**
   * @param {string|null} file
   */
  async load (file = null) {
    super.filePath = file

    let rawContent

    try {
      rawContent = await fs.readFile(this.filePath)
    } catch (e) {
      throw new ServiceFileNotFoundException(this.filePath)
    }

    let content

    try {
      content = await yaml.load(rawContent)
    } catch (e) {
      throw new ServiceFileNotLoadedException(e.message)
    }

    await this._parseImports(content.imports)
    await this._parseParameters(content.parameters)
    await this._parseDefinitions(content.services)
  }

  /**
   * @param {string|null} file
   */
  loadSync (file = null) {
    super.filePath = file

    let rawContent

    try {
      rawContent = fsSync.readFileSync(this.filePath)
    } catch (e) {
      throw new ServiceFileNotFoundException(this.filePath)
    }

    let content

    try {
      content = yaml.load(rawContent)
    } catch (e) {
      throw new ServiceFileNotLoadedException(e.message)
    }

    this._parseImportsSync(content.imports)
    this._parseParametersSync(content.parameters)
    this._parseDefinitionsSync(content.services)
  }
}
