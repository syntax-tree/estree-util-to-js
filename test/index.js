/**
 * @typedef {import('estree-jsx').Program} Program
 */

import test from 'tape'
import {Parser} from 'acorn'
import acornJsx from 'acorn-jsx'
import {SourceMapGenerator} from 'source-map'
import {toJs, jsx} from '../index.js'

test('estree-util-from-js', (t) => {
  t.deepEqual(
    toJs(fromJs('const a = 1')),
    {value: 'const a = 1;\n', map: undefined},
    'should serialize js'
  )

  t.deepEqual(
    toJs(fromJs('const a = 1'), {SourceMapGenerator}),
    {
      value: 'const a = 1;\n',
      map: {
        version: 3,
        sources: ['<unknown>.js'],
        names: ['a'],
        mappings: 'MAAMA,IAAI',
        file: '<unknown>.js'
      }
    },
    'should serialize js w/ a source map'
  )

  t.deepEqual(
    toJs(fromJs('const a = 1'), {SourceMapGenerator, filePath: 'example.js'}),
    {
      value: 'const a = 1;\n',
      map: {
        version: 3,
        sources: ['example.js'],
        names: ['a'],
        mappings: 'MAAMA,IAAI',
        file: 'example.js'
      }
    },
    'should serialize js w/ a source map and a file path'
  )

  t.equal(
    toJs(fromJs('<a>1</a>', true), {handlers: jsx}).value,
    '<a>1</a>;\n',
    'should supports jsx (opening and closing tag)'
  )

  t.equal(
    toJs(fromJs('<>1</>', true), {handlers: jsx}).value,
    '<>1</>;\n',
    'should supports jsx (opening and closing fragment)'
  )

  t.equal(
    toJs(fromJs('<a.b />', true), {handlers: jsx}).value,
    '<a.b />;\n',
    'should supports jsx (member name)'
  )

  t.equal(
    toJs(fromJs('<a:b />', true), {handlers: jsx}).value,
    '<a:b />;\n',
    'should supports jsx (namespaced name)'
  )

  t.equal(
    toJs(fromJs('<a b c="d" e={f} {...g} />', true), {handlers: jsx}).value,
    '<a b c="d" e={f} {...g} />;\n',
    'should supports jsx (attributes)'
  )

  t.equal(
    toJs(fromJs('<a b:c />', true), {handlers: jsx}).value,
    '<a b:c />;\n',
    'should supports jsx (namespaced attribute)'
  )

  t.equal(
    toJs(fromJs('<a>empty: {}, comment: {/*b*/}, value: {1}</a>', true), {
      handlers: jsx
    }).value,
    '<a>empty: {}, comment: {}, value: {1}</a>;\n',
    'should supports jsx (expressions)'
  )

  t.equal(
    toJs(fromJs('<a>1 &lt; 2 &gt; 3 &#123; 4 &#125; 5</a>', true), {
      handlers: jsx
    }).value,
    '<a>1 &lt; 2 &gt; 3 &#123; 4 &#125; 5</a>;\n',
    'should supports jsx (text)'
  )

  t.end()
})

/**
 * @param {string} value
 * @param {boolean} [jsx=false]
 * @returns {Program}
 */
function fromJs(value, jsx = false) {
  const parser = jsx ? Parser.extend(acornJsx()) : Parser
  // @ts-expect-error: fine.
  return parser.parse(value, {
    ecmaVersion: 2022,
    sourceType: 'module',
    locations: true
  })
}
