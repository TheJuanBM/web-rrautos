#!/usr/bin/env node

import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { extname, join } from 'path'
import { brotliCompressSync, gzipSync, constants as zlibConstants } from 'zlib'

const DIST_DIR = './dist'

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath)

  files.forEach(file => {
    const fullPath = join(dirPath, file)
    if (statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles)
    } else {
      arrayOfFiles.push(fullPath)
    }
  })

  return arrayOfFiles
}

function shouldCompress(filePath) {
  const ext = extname(filePath).toLowerCase()
  const compressibleExts = ['.html', '.css', '.js', '.json', '.xml', '.svg', '.txt']
  return compressibleExts.includes(ext)
}

function compressFile(filePath) {
  try {
    const content = readFileSync(filePath)
    const originalSize = content.length

    // Skip archivos muy pequeños
    if (originalSize < 1024) return

    // Crear versión gzip
    const gzipContent = gzipSync(content, { level: 9 })
    writeFileSync(`${filePath}.gz`, gzipContent)

    // Crear versión brotli
    const brotliContent = brotliCompressSync(content, {
      params: {
        [zlibConstants.BROTLI_PARAM_QUALITY]: 11,
        [zlibConstants.BROTLI_PARAM_SIZE_HINT]: originalSize,
      },
    })
    writeFileSync(`${filePath}.br`, brotliContent)

    const gzipRatio = (((originalSize - gzipContent.length) / originalSize) * 100).toFixed(1)
    const brotliRatio = (((originalSize - brotliContent.length) / originalSize) * 100).toFixed(1)

    console.log(`✅ ${filePath}:`)
    console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`)
    console.log(`   Gzip: ${(gzipContent.length / 1024).toFixed(1)}KB (-${gzipRatio}%)`)
    console.log(`   Brotli: ${(brotliContent.length / 1024).toFixed(1)}KB (-${brotliRatio}%)`)
  } catch (error) {
    console.error(`❌ Error compressing ${filePath}:`, error.message)
  }
}

function optimizeBuild() {
  console.log('🚀 Optimizando build...\n')

  const allFiles = getAllFiles(DIST_DIR)
  const compressibleFiles = allFiles.filter(shouldCompress)

  console.log(`📦 Encontrados ${compressibleFiles.length} archivos para comprimir\n`)

  let totalOriginal = 0
  let totalGzip = 0
  let totalBrotli = 0

  compressibleFiles.forEach(file => {
    compressFile(file)

    // Calcular totales
    const original = statSync(file).size
    const gzipPath = `${file}.gz`
    const brotliPath = `${file}.br`

    try {
      const gzipSize = statSync(gzipPath).size
      const brotliSize = statSync(brotliPath).size

      totalOriginal += original
      totalGzip += gzipSize
      totalBrotli += brotliSize
    } catch {
      console.error('Archivo no fue comprimido')
    }
  })

  console.log('\n📊 RESUMEN TOTAL:')
  console.log(`   Original: ${(totalOriginal / 1024).toFixed(1)}KB`)
  console.log(
    `   Gzip: ${(totalGzip / 1024).toFixed(1)}KB (-${(((totalOriginal - totalGzip) / totalOriginal) * 100).toFixed(1)}%)`
  )
  console.log(
    `   Brotli: ${(totalBrotli / 1024).toFixed(1)}KB (-${(((totalOriginal - totalBrotli) / totalOriginal) * 100).toFixed(1)}%)`
  )

  console.log('\n✅ Optimización completada!')
  console.log('\n💡 Para usar la compresión:')
  console.log('   - Apache: Usar el archivo .htaccess incluido')
  console.log('   - Nginx: Usar el archivo nginx.conf.example')
  console.log('   - Cloudflare: La compresión se aplicará automáticamente')
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeBuild()
}

export { optimizeBuild }
