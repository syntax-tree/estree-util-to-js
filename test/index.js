/**
 * @typedef {import('estree-jsx').Program} Program
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {Parser} from 'acorn'
import acornJsx from 'acorn-jsx'
import {jsx, toJs} from 'estree-util-to-js'
import {SourceMapGenerator} from 'source-map'

test('toJs', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('estree-util-to-js')).sort(), [
      'jsx',
      'toJs'
    ])
  })

  await t.test('should serialize js', async function () {
    assert.deepEqual(toJs(fromJs('const a = 1')), {
      value: 'const a = 1;\n',
      map: undefined
    })
  })

  await t.test('should serialize js w/ a source map', async function () {
    assert.deepEqual(toJs(fromJs('const a = 1'), {SourceMapGenerator}), {
      value: 'const a = 1;\n',
      map: {
        version: 3,
        sources: ['<unknown>.js'],
        names: ['a'],
        mappings: 'MAAMA,IAAI',
        file: '<unknown>.js'
      }
    })
  })

  await t.test(
    'should serialize js w/ a source map and a file path',
    async function () {
      assert.deepEqual(
        toJs(fromJs('const a = 1'), {
          SourceMapGenerator,
          filePath: 'example.js'
        }),
        {
          value: 'const a = 1;\n',
          map: {
            version: 3,
            sources: ['example.js'],
            names: ['a'],
            mappings: 'MAAMA,IAAI',
            file: 'example.js'
          }
        }
      )
    }
  )

  await t.test(
    'should supports jsx (opening and closing tag)',
    async function () {
      assert.equal(
        toJs(fromJs('<a>1</a>', true), {handlers: jsx}).value,
        '<a>1</a>;\n'
      )
    }
  )

  await t.test(
    'should supports jsx (opening and closing fragment)',
    async function () {
      assert.equal(
        toJs(fromJs('<>1</>', true), {handlers: jsx}).value,
        '<>1</>;\n'
      )
    }
  )

  await t.test('should supports jsx (member name)', async function () {
    assert.equal(
      toJs(fromJs('<a.b />', true), {handlers: jsx}).value,
      '<a.b />;\n'
    )
  })

  await t.test('should supports jsx (namespaced name)', async function () {
    assert.equal(
      toJs(fromJs('<a:b />', true), {handlers: jsx}).value,
      '<a:b />;\n'
    )
  })

  await t.test('should supports jsx (attributes)', async function () {
    assert.equal(
      toJs(fromJs('<a b c="d" e={f} {...g} />', true), {handlers: jsx}).value,
      '<a b c="d" e={f} {...g} />;\n'
    )
  })

  await t.test('should supports jsx (namespaced attribute)', async function () {
    assert.equal(
      toJs(fromJs('<a b:c />', true), {handlers: jsx}).value,
      '<a b:c />;\n'
    )
  })

  await t.test('should supports jsx (expressions)', async function () {
    assert.equal(
      toJs(fromJs('<a>empty: {}, comment: {/*b*/}, value: {1}</a>', true), {
        handlers: jsx
      }).value,
      '<a>empty: {}, comment: {}, value: {1}</a>;\n'
    )
  })

  await t.test('should supports jsx (text)', async function () {
    assert.equal(
      toJs(fromJs('<a>1 &lt; 2 &gt; 3 &#123; 4 &#125; 5</a>', true), {
        handlers: jsx
      }).value,
      '<a>1 &lt; 2 &gt; 3 &#123; 4 &#125; 5</a>;\n'
    )
  })
})

/**
 * @param {string} value
 *   JavaScript.
 * @param {boolean | null | undefined} [jsx=false]
 *   Whether to parse as JSX (default: `false`).
 * @returns {Program}
 *   ESTree program.
 */
function fromJs(value, jsx) {
  const parser = jsx ? Parser.extend(acornJsx()) : Parser
  // @ts-expect-error: fine.
  return parser.parse(value, {
    ecmaVersion: 2022,
    sourceType: 'module',
    locations: true
  })
}
