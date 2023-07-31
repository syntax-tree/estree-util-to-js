/**
 * @typedef {import('estree-jsx').Node} Node
 * @typedef {import('source-map').Mapping} Mapping
 */

/**
 * @typedef {import('astring').State} State
 */

/**
 * @typedef {Record<Node['type'], Handler>} Generator
 * @typedef {Partial<Generator>} Handlers
 *   Handlers for different nodes.
 *
 * @callback Handler
 *  Handle a particular node.
 * @param {Generator} this
 *   `astring` generator.
 * @param {any} node
 *   Node to serialize.
 * @param {State} state
 *   Info passed around.
 * @returns {void}
 *   Nothing.
 */

export {}
