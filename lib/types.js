/**
 * @typedef {import('estree-jsx').Node} Node
 * @typedef {import('source-map').Mapping} Mapping
 */

// To do: `astring` types are broken.
// Either `import('astring').State` if everything is fixed, or:
// `Omit<import('astring').State, 'write'> & {write: ((code: string, node?: Node) => void)}`
/**
 * @typedef State
 * @property {string} output
 * @property {(code: string, node?: Node) => void} write
 * @property {boolean} writeComments
 * @property {string} indent
 * @property {string} lineEnd
 * @property {number} indentLevel
 * @property {number | undefined} [line]
 * @property {number | undefined} [column]
 * @property {number | undefined} [lineEndSize]
 * @property {Mapping | undefined} [mapping]
 */

/**
 * @typedef {Record<Node['type'], Handler>} Generator
 * @typedef {Partial<Generator>} Handlers
 *
 * @callback Handler
 * @param {Generator} this
 * @param {any} node
 * @param {State} state
 * @returns {void}
 */

export {}
