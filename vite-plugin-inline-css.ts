import type { Plugin } from 'vite'

export default function inlineCSS(): Plugin {
    return {
        name: 'vite-plugin-inline-css',
        apply: 'build',
        enforce: 'post',
        transformIndexHtml: {
            order: 'post',
            handler(html, { bundle }) {
                if (!bundle) return html

                // CSSファイルを見つける
                const cssFiles = Object.keys(bundle).filter(
                    (file) => file.endsWith('.css')
                )

                if (cssFiles.length === 0) return html

                let modifiedHtml = html

                // 各CSSファイルをインライン化
                cssFiles.forEach((cssFile) => {
                    const cssAsset = bundle[cssFile]
                    if (cssAsset && 'source' in cssAsset) {
                        const cssContent = cssAsset.source.toString()

                        // HTML内のCSSリンクをインラインスタイルに置換
                        const linkPattern = new RegExp(
                            `<link[^>]*href=["'][^"']*${cssFile}["'][^>]*>`,
                            'g'
                        )

                        modifiedHtml = modifiedHtml.replace(
                            linkPattern,
                            `<style>${cssContent}</style>`
                        )

                        // ビルド出力からCSSファイルを削除
                        delete bundle[cssFile]
                    }
                })

                return modifiedHtml
            }
        }
    }
}
