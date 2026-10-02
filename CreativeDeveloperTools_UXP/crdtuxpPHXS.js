// Copyright (c) 2024–present Rorohiko Ltd. All rights reserved.
// SPDX-License-Identifier: Elastic-2.0
// https://github.com/zwettemaan/CRDT_UXP

/**
 * Creative Developer Tools (CRDT) is a growing suite of tools aimed at script developers<br>
 * and plug-in developers for the Adobe Creative Cloud eco-system.<br>
 * <br>
 * This module provides functions that are specific to Adobe Photoshop.<br>
 * <br>
 * Started (2026) with a per-document config-layer API - a dedicated layer
 * group used as an INI-style settings store inside the PSD itself, since
 * Photoshop (unlike InDesign) has no pasteboard and most of its own
 * preferences are global rather than per-document. See PXConfig
 * (https://github.com/zwettemaan/PXConfig) for the first consumer.<br>
 * <br>
 * Intended to grow into a general collection of Photoshop-specific
 * UXP/UXPScript helpers over time, the way crdtuxpIDSN.js did for InDesign -
 * not just the config-layer API.
 *
 * @module crdtuxpPHXS
 * @namespace crdtuxpPHXS
 */

if (! module.exports) {
    module.exports = {};
}
let crdtuxpPHXS = module.exports;

let crdtuxp = getCRDTUXP();

const REGEXP_TRIM                      = /^\s*(\S?.*?)\s*$/;
const REGEXP_TRIM_REPLACE              = "$1";
const REGEXP_DESPACE                   = /\s+/g;
const REGEXP_DESPACE_REPLACE           = "";
const REGEXP_ALPHA_ONLY                = /[^-a-zA-Z0-9_$]+/g;
const REGEXP_ALPHA_ONLY_REPLACE        = "";
const REGEXP_SECTION_NAME_ONLY         = /[^-a-zA-Z0-9_$:]+/g;
const REGEXP_SECTION_NAME_ONLY_REPLACE = "";
const REGEXP_HEX_COLOR                 = /^#?([0-9a-fA-F]{6})$/;

const STATE_IDLE                       = 0;
const STATE_SEEN_OPEN_SQUARE_BRACKET   = 1;
const STATE_SEEN_NON_WHITE             = 2;
const STATE_SEEN_EQUAL                 = 4;
const STATE_ERROR                      = 5;
const STATE_SEEN_CLOSE_SQUARE_BRACKET  = 6;
const STATE_IN_COMMENT                 = 7;

function getCRDTUXP() {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            retVal = global.crdtuxp;
            if (retVal) {
                break;
            }

            if (typeof require != "function") {
                break;
            }

            retVal = require("./crdtuxp.js");
            if (retVal) {
                global.crdtuxp = retVal;
            }
        }
        catch (err) {
        }
    }
    while (false);

    return retVal;
}

/**
 * Get the Photoshop UXP `photoshop` module's `app`/`constants` objects.
 * Centralises the `require("photoshop")` call so every function below goes
 * through the same spot.
 *
 * @function getPhotoshop
 * @memberOf crdtuxpPHXS
 *
 * @returns {object} `{ app, constants }`, or `undefined` if not running
 *   inside Photoshop's UXP host (e.g. required from a non-Photoshop context).
 */

function getPhotoshop() {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            if (typeof require != "function") {
                break;
            }

            let photoshop = require("photoshop");
            if (! photoshop || ! photoshop.app || ! photoshop.constants) {
                break;
            }

            retVal = photoshop;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.getPhotoshop = getPhotoshop;

/**
 * Run a callback inside Photoshop's required `executeAsModal` wrapper -
 * needed for any document-mutating call (layer create/move/visibility/
 * selection, etc.), which Photoshop's UXP API rejects outside of one.
 * Centralised here so every PXConfig-style script uses the same wrapper
 * instead of each reimplementing it.
 *
 * @function runModal
 * @memberOf crdtuxpPHXS
 *
 * @param {Function} callback - function to run inside the modal scope; may
 *   be `async` and/or return a Promise
 * @param {string} commandName - label shown in Photoshop's Undo history
 * @returns {Promise} resolves with `callback`'s return value, rejects if
 *   `callback` throws or this isn't running inside Photoshop
 */

function runModal(callback, commandName) {
// coderstate: promisor
    let retVal = Promise.resolve(undefined);

    do {
        try {
            let photoshop = getPhotoshop();
            if (! photoshop) {
                crdtuxp.logError(arguments, "not running inside Photoshop");
                break;
            }

            retVal = photoshop.core.executeAsModal(
                callback,
                { commandName: commandName || "PXConfig" }
            );
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.runModal = runModal;

/**
 * Find the first top-level layer group in a document whose name contains
 * `nameSubstring`.
 *
 * @function findLayerGroupByNameSubstring
 * @memberOf crdtuxpPHXS
 *
 * @param {Document} doc - a Photoshop UXP `Document` (e.g. `app.activeDocument`)
 * @param {string} nameSubstring - substring to look for in top-level group names
 * @returns {Layer} the matching layer group, or `undefined` if not found
 */

function findLayerGroupByNameSubstring(doc, nameSubstring) {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            if (! doc || ! nameSubstring) {
                crdtuxp.logError(arguments, "need doc and nameSubstring");
                break;
            }

            let photoshop = getPhotoshop();
            if (! photoshop) {
                crdtuxp.logError(arguments, "not running inside Photoshop");
                break;
            }

            let layers = doc.layers;
            if (! layers) {
                break;
            }

            for (let idx = 0; idx < layers.length; idx++) {
                let layer = layers[idx];
                if (! layer) {
                    continue;
                }

                let isGroup = layer.kind == photoshop.constants.LayerKind.GROUP;
                if (! isGroup) {
                    continue;
                }

                if (layer.name && layer.name.indexOf(nameSubstring) != -1) {
                    retVal = layer;
                    break;
                }
            }
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.findLayerGroupByNameSubstring = findLayerGroupByNameSubstring;

/**
 * Collect all text layers directly inside a layer group, sorted
 * left-to-right by the left edge of their bounds.
 *
 * @function collectTextLayersSortedByX
 * @memberOf crdtuxpPHXS
 *
 * @param {Layer} group - a Photoshop UXP layer group
 * @returns {Layer[]} text layers, sorted by `bounds.left` ascending (empty
 *   array if `group` has no text layers or is falsy)
 */

function collectTextLayersSortedByX(group) {
// coderstate: function
    let retVal = [];

    do {
        try {
            if (! group || ! group.layers) {
                break;
            }

            let photoshop = getPhotoshop();
            if (! photoshop) {
                crdtuxp.logError(arguments, "not running inside Photoshop");
                break;
            }

            let textLayers = [];
            let layers = group.layers;
            for (let idx = 0; idx < layers.length; idx++) {
                let layer = layers[idx];
                if (layer && layer.kind == photoshop.constants.LayerKind.TEXT) {
                    textLayers.push(layer);
                }
            }

            textLayers.sort(
                function compareByLeft(layerA, layerB) {
                    let leftA = (layerA.bounds && layerA.bounds.left) || 0;
                    let leftB = (layerB.bounds && layerB.bounds.left) || 0;
                    return leftA - leftB;
                }
            );

            retVal = textLayers;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.collectTextLayersSortedByX = collectTextLayersSortedByX;

/**
 * Concatenate the text contents of a list of text layers, one per line,
 * in the order given (see `collectTextLayersSortedByX` for left-to-right
 * column ordering).
 *
 * @function concatenateTextLayerContents
 * @memberOf crdtuxpPHXS
 *
 * @param {Layer[]} textLayers - array of Photoshop UXP text layers
 * @returns {string} contents joined with `"\n"` (empty string if
 *   `textLayers` is empty or falsy)
 */

function concatenateTextLayerContents(textLayers) {
// coderstate: function
    let retVal = "";

    do {
        try {
            if (! textLayers || ! textLayers.length) {
                break;
            }

            let parts = [];
            for (let idx = 0; idx < textLayers.length; idx++) {
                let layer = textLayers[idx];
                let contents = (layer && layer.textItem && layer.textItem.contents) || "";
                parts.push(contents);
            }

            retVal = parts.join("\n");
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.concatenateTextLayerContents = concatenateTextLayerContents;

/**
 * Find a config layer group in a document, read its text layers and parse
 * them as INI data, in one call. Equivalent to:
 * `readINI(concatenateTextLayerContents(collectTextLayersSortedByX(findLayerGroupByNameSubstring(doc, groupNameMarker))))`
 *
 * @function readConfigFromGroup
 * @memberOf crdtuxpPHXS
 *
 * @param {Document} doc - a Photoshop UXP `Document`
 * @param {string} groupNameMarker - substring identifying the config layer
 *   group (e.g. `"[photoshop-config]"`)
 * @returns {object} the parsed INI object, or `undefined` if no matching
 *   group was found or it had no readable INI content
 */

function readConfigFromGroup(doc, groupNameMarker) {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            let group = findLayerGroupByNameSubstring(doc, groupNameMarker);
            if (! group) {
                break;
            }

            let textLayers = collectTextLayersSortedByX(group);
            let text = concatenateTextLayerContents(textLayers);

            retVal = readINI(text);
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.readConfigFromGroup = readConfigFromGroup;

/**
 * Find a config layer group, read it as INI data, and hand that data to a
 * caller-supplied callback - the "apply" part is always specific to
 * whatever product built the config layer (which sections/keys it
 * supports, what each one means), so that logic lives in the calling
 * script, not here. This function only owns the generic, reusable part:
 * find the group, extract the data, dispatch it.
 *
 * @function applyConfigFromGroup
 * @memberOf crdtuxpPHXS
 *
 * @param {Document} doc - a Photoshop UXP `Document`
 * @param {string} groupNameMarker - substring identifying the config layer
 *   group (e.g. `"[photoshop-config]"`)
 * @param {Function} callback - `function(configData, group, doc)`, called
 *   once the group is found and its content parsed; `configData` is
 *   whatever `readINI` returns (may be `undefined` if the group had no
 *   readable INI content - callbacks should handle that). May be `async`
 *   and/or return a Promise; whatever it returns/resolves to is returned
 *   by `applyConfigFromGroup` in turn. Mutating the document from inside
 *   the callback still needs `crdtuxpPHXS.runModal`, same as any other
 *   document edit.
 * @returns the callback's return value, or `undefined` if no matching
 *   group was found (callback is never called in that case) or the
 *   arguments are invalid
 */

function applyConfigFromGroup(doc, groupNameMarker, callback) {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            if (! doc || ! groupNameMarker || "function" != typeof callback) {
                crdtuxp.logError(arguments, "need doc, groupNameMarker and callback");
                break;
            }

            let group = findLayerGroupByNameSubstring(doc, groupNameMarker);
            if (! group) {
                break;
            }

            let configData = readConfigFromGroup(doc, groupNameMarker);

            retVal = callback(configData, group, doc);
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.applyConfigFromGroup = applyConfigFromGroup;

/**
 * Show or hide a layer.
 *
 * @function setLayerVisible
 * @memberOf crdtuxpPHXS
 *
 * @param {Layer} layer - a Photoshop UXP layer (or layer group)
 * @param {boolean} visible - true to show, false to hide
 * @returns {boolean} true on success
 */

function setLayerVisible(layer, visible) {
// coderstate: function
    let retVal = false;

    do {
        try {
            if (! layer) {
                crdtuxp.logError(arguments, "need layer");
                break;
            }

            layer.visible = !! visible;

            retVal = true;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.setLayerVisible = setLayerVisible;

/**
 * Set the document's selected layers.
 *
 * @function selectLayers
 * @memberOf crdtuxpPHXS
 *
 * @param {Document} doc - a Photoshop UXP `Document`
 * @param {Layer[]} layers - layers to select; pass an empty array (or
 *   `undefined`) to deselect everything
 * @returns {boolean} true on success
 */

function selectLayers(doc, layers) {
// coderstate: function
    let retVal = false;

    do {
        try {
            if (! doc) {
                crdtuxp.logError(arguments, "need doc");
                break;
            }

            doc.activeLayers = layers || [];

            retVal = true;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.selectLayers = selectLayers;

/**
 * Deselect all layers in a document. Shorthand for `selectLayers(doc, [])`.
 *
 * @function deselectAllLayers
 * @memberOf crdtuxpPHXS
 *
 * @param {Document} doc - a Photoshop UXP `Document`
 * @returns {boolean} true on success
 */

function deselectAllLayers(doc) {
// coderstate: function
    return selectLayers(doc, []);
}
crdtuxpPHXS.deselectAllLayers = deselectAllLayers;

/**
 * Move a layer to the top of its own stack (within its parent group, or
 * within the document if it's a top-level layer).
 *
 * @function moveLayerToBeginning
 * @memberOf crdtuxpPHXS
 *
 * @param {Layer} layer - a Photoshop UXP layer (or layer group); must have
 *   a `.parent` (a top-level layer's parent is the document itself)
 * @returns {boolean} true on success
 */

function moveLayerToBeginning(layer) {
// coderstate: function
    let retVal = false;

    do {
        try {
            if (! layer || ! layer.parent) {
                crdtuxp.logError(arguments, "need layer with a parent");
                break;
            }

            let photoshop = getPhotoshop();
            if (! photoshop) {
                crdtuxp.logError(arguments, "not running inside Photoshop");
                break;
            }

            layer.move(layer.parent, photoshop.constants.ElementPlacement.PLACEATBEGINNING);

            retVal = true;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.moveLayerToBeginning = moveLayerToBeginning;

/**
 * Move a layer to the bottom of its own stack (within its parent group, or
 * within the document if it's a top-level layer).
 *
 * @function moveLayerToEnd
 * @memberOf crdtuxpPHXS
 *
 * @param {Layer} layer - a Photoshop UXP layer (or layer group); must have
 *   a `.parent` (a top-level layer's parent is the document itself)
 * @returns {boolean} true on success
 */

function moveLayerToEnd(layer) {
// coderstate: function
    let retVal = false;

    do {
        try {
            if (! layer || ! layer.parent) {
                crdtuxp.logError(arguments, "need layer with a parent");
                break;
            }

            let photoshop = getPhotoshop();
            if (! photoshop) {
                crdtuxp.logError(arguments, "not running inside Photoshop");
                break;
            }

            layer.move(layer.parent, photoshop.constants.ElementPlacement.PLACEATEND);

            retVal = true;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.moveLayerToEnd = moveLayerToEnd;

/**
 * Expand or collapse a layer group's twirl-down in the Layers panel.
 *
 * NOT YET IMPLEMENTED - the Layers-panel expand/collapse state has no
 * documented direct UXP DOM property (same gap exists in classic
 * ExtendScript), and likely needs `batchPlay` - not yet researched/
 * verified. Exists as a named stub so callers (ShowConfig/HideConfig) have
 * one place to call and one place to fix later, instead of each
 * reimplementing/skipping this independently. Note: selecting a layer
 * inside a collapsed group auto-expands it in the UI as a side effect, so
 * a caller that only needs the group's content visible/selectable (e.g.
 * ShowConfig selecting its first text layer via `selectLayers`) may not
 * need this at all.
 *
 * @function setLayerGroupExpanded
 * @memberOf crdtuxpPHXS
 *
 * @param {Layer} group - a Photoshop UXP layer group
 * @param {boolean} expanded - true to expand, false to collapse
 * @returns {boolean} always `false` currently
 */

function setLayerGroupExpanded(group, expanded) {
// coderstate: function
    crdtuxp.logError(arguments, "setLayerGroupExpanded: not implemented - needs batchPlay research");
    return false;
}
crdtuxpPHXS.setLayerGroupExpanded = setLayerGroupExpanded;

/**
 * Delete all text layers directly inside a group, optionally preserving
 * one whose name contains `preserveNameSubstring` (e.g. a border/frame
 * layer that isn't part of the text content). Must be called from inside
 * `crdtuxpPHXS.runModal`.
 *
 * @function deleteTextLayersInGroup
 * @memberOf crdtuxpPHXS
 *
 * @param {Layer} group - a Photoshop UXP layer group
 * @param {string} [preserveNameSubstring] - substring identifying a layer
 *   to leave alone (e.g. `"[config-border]"`)
 * @returns {boolean} true on success
 */

function deleteTextLayersInGroup(group, preserveNameSubstring) {
// coderstate: function
    let retVal = false;

    do {
        try {
            if (! group || ! group.layers) {
                crdtuxp.logError(arguments, "need group");
                break;
            }

            let photoshop = getPhotoshop();
            if (! photoshop) {
                crdtuxp.logError(arguments, "not running inside Photoshop");
                break;
            }

            // Walk backwards - deleting while iterating forward skips
            // entries as the live collection shifts under us.
            let layers = group.layers;
            for (let idx = layers.length - 1; idx >= 0; idx--) {
                let layer = layers[idx];
                if (! layer || layer.kind != photoshop.constants.LayerKind.TEXT) {
                    continue;
                }

                if (preserveNameSubstring && layer.name && layer.name.indexOf(preserveNameSubstring) != -1) {
                    continue;
                }

                layer.delete();
            }

            retVal = true;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.deleteTextLayersInGroup = deleteTextLayersInGroup;

/**
 * Create a new, empty top-level layer group.
 *
 * Not independently verified against a real Photoshop install (no local
 * precedent to crib from when this was written), but `Document.createLayerGroup`
 * is Adobe's documented, commonly-shown UXP API for this - higher
 * confidence than `createTextLayer`'s `textItem` styling guesses below.
 * Must be called from inside `crdtuxpPHXS.runModal`.
 *
 * @function createLayerGroup
 * @memberOf crdtuxpPHXS
 *
 * @param {Document} doc - a Photoshop UXP `Document`
 * @param {string} name - group name
 * @returns {Layer} the new layer group, or `undefined` on failure
 */

function createLayerGroup(doc, name) {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            if (! doc) {
                crdtuxp.logError(arguments, "need doc");
                break;
            }

            let photoshop = getPhotoshop();
            if (! photoshop) {
                crdtuxp.logError(arguments, "not running inside Photoshop");
                break;
            }

            retVal = doc.createLayerGroup({ name: name || "" });
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.createLayerGroup = createLayerGroup;

/**
 * Create a text layer inside a group, with position and basic style.
 *
 * UNVERIFIED AGAINST A REAL PHOTOSHOP INSTALL - the overall shape
 * (`document.createLayer` with `LayerKind.TEXT`, then set `.textItem`
 * properties) matches Adobe's documented UXP Photoshop API, but the exact
 * `textItem` property names used for font/size/color have not been
 * confirmed live. Treat this as a first draft to verify/fix in one place
 * (both NewConfig and CleanConfig call this), not a proven implementation.
 * Must be called from inside `crdtuxpPHXS.runModal`.
 *
 * @function createTextLayer
 * @memberOf crdtuxpPHXS
 *
 * @param {Document} doc - a Photoshop UXP `Document`
 * @param {Layer} parentGroup - group to create the layer inside
 * @param {string} name - layer name
 * @param {string} contents - text contents
 * @param {object} [options] - `{ left, top, fontName, fontSizePt, color: {r,g,b} }`,
 *   all optional
 * @returns {Layer} the new text layer, or `undefined` on failure
 */

function createTextLayer(doc, parentGroup, name, contents, options) {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            if (! doc || ! parentGroup) {
                crdtuxp.logError(arguments, "need doc and parentGroup");
                break;
            }

            let photoshop = getPhotoshop();
            if (! photoshop) {
                crdtuxp.logError(arguments, "not running inside Photoshop");
                break;
            }

            let opts = options || {};

            let layer = doc.createLayer(
                photoshop.constants.LayerKind.TEXT,
                { name: name || "" }
            );
            if (! layer) {
                crdtuxp.logError(arguments, "createLayer returned nothing");
                break;
            }

            layer.move(parentGroup, photoshop.constants.ElementPlacement.PLACEINSIDE);

            layer.textItem.contents = contents || "";

            if (opts.fontName) {
                layer.textItem.font = opts.fontName;
            }
            if (opts.fontSizePt) {
                layer.textItem.size = opts.fontSizePt;
            }
            if (opts.color) {
                let solidColor = new photoshop.SolidColor();
                solidColor.rgb.red   = opts.color.r;
                solidColor.rgb.green = opts.color.g;
                solidColor.rgb.blue  = opts.color.b;
                layer.textItem.characterStyle.color = solidColor;
            }

            layer.textItem.position = [opts.left || 0, opts.top || 0];

            retVal = layer;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.createTextLayer = createTextLayer;

/**
 * Reformat raw text as a tidy, consistent set of INI lines, WITHOUT parsing
 * it into an object - unlike `readINI`, comments and blank lines are
 * preserved so this is safe to use on content a human has annotated. Per
 * line:<br>
 * <br>
 * - Blank lines are kept as-is.<br>
 * - Lines starting with `;` or `#` (comments) are kept as-is.<br>
 * - `[section]` headers are normalised the same way `readINI` normalises
 *   section names (lowercased, de-spaced, stripped to `[-a-zA-Z0-9_$:]`).<br>
 * - `key = value` lines have their spacing normalised to `key = value`
 *   (the key itself is trimmed but NOT otherwise normalised/case-folded,
 *   unlike `readINI` - this is a display reformat, not a re-parse).<br>
 * - Any other line is discarded.<br>
 *
 * @function reformatINILines
 * @memberOf crdtuxpPHXS
 *
 * @param {string} text - raw text to reformat
 * @returns {string[]} the reformatted lines (empty array if `text` is
 *   empty/not a string)
 */

function reformatINILines(text) {
// coderstate: function
    let retVal = [];

    do {
        try {
            if (! text || "string" != typeof text) {
                break;
            }

            let rawLines = text.split(/\r\n|\r|\n/);
            let lines = [];

            for (let idx = 0; idx < rawLines.length; idx++) {
                let line = rawLines[idx].replace(REGEXP_TRIM, REGEXP_TRIM_REPLACE);

                if (! line) {
                    lines.push("");
                    continue;
                }

                let firstChar = line.charAt(0);
                if (firstChar == ";" || firstChar == "#") {
                    lines.push(line);
                    continue;
                }

                if (firstChar == "[" && line.charAt(line.length - 1) == "]") {
                    let sectionName = line.substring(1, line.length - 1);
                    sectionName = sectionName.toLowerCase().replace(REGEXP_DESPACE, REGEXP_DESPACE_REPLACE);
                    sectionName = sectionName.replace(REGEXP_SECTION_NAME_ONLY, REGEXP_SECTION_NAME_ONLY_REPLACE);
                    if (sectionName) {
                        lines.push("[" + sectionName + "]");
                    }
                    continue;
                }

                let equalIdx = line.indexOf("=");
                if (equalIdx > 0) {
                    let key = line.substring(0, equalIdx).replace(REGEXP_TRIM, REGEXP_TRIM_REPLACE);
                    let value = line.substring(equalIdx + 1).replace(REGEXP_TRIM, REGEXP_TRIM_REPLACE);
                    if (key) {
                        lines.push(key + " = " + value);
                    }
                    continue;
                }

                // Anything else is silently discarded (same rule readINI
                // applies implicitly by never storing it).
            }

            retVal = lines;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.reformatINILines = reformatINILines;

/**
 * Split a list of lines into column-sized chunks, each chunk joined back
 * into a single string with `"\n"` - the inverse of
 * `concatenateTextLayerContents`/`collectTextLayersSortedByX`.
 *
 * @function splitLinesIntoColumns
 * @memberOf crdtuxpPHXS
 *
 * @param {string[]} lines - lines to split
 * @param {number} linesPerColumn - max lines per column (must be > 0)
 * @returns {string[]} one string per column, left-to-right order
 */

function splitLinesIntoColumns(lines, linesPerColumn) {
// coderstate: function
    let retVal = [];

    do {
        try {
            if (! lines || ! lines.length || ! linesPerColumn || linesPerColumn <= 0) {
                break;
            }

            let columns = [];
            for (let idx = 0; idx < lines.length; idx += linesPerColumn) {
                columns.push(lines.slice(idx, idx + linesPerColumn).join("\n"));
            }

            retVal = columns;
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.splitLinesIntoColumns = splitLinesIntoColumns;

/**
 * Interpret a string as a boolean, the way an INI value would be: `y`, `n`,
 * `yes`, `no`, `true`, `false`, `t`, `f`, `0`, `1` (case-insensitive, only
 * the first character is actually examined, matching CRDT_ES's
 * `crdtes.getBooleanFromINI`).
 *
 * @function getBooleanFromINI
 * @memberOf crdtuxpPHXS
 *
 * @param {string} value - ini value
 * @returns {boolean} value
 */

function getBooleanFromINI(value) {
// coderstate: function
    let retVal = false;

    if (value) {
        let trimmed = (value + "").replace(REGEXP_TRIM, REGEXP_TRIM_REPLACE);
        let firstChar = trimmed.charAt(0).toLowerCase();
        let firstValue = parseInt(firstChar, 10);
        retVal = firstChar == "y" || firstChar == "t" || (! isNaN(firstValue) && firstValue != 0);
    }

    return retVal;
}
crdtuxpPHXS.getBooleanFromINI = getBooleanFromINI;

/**
 * Parse INI-formatted text into a nested object, one property per section,
 * one property per key within each section. Direct port of CRDT_ES's
 * `crdtes.readINI` (character-by-character state machine) - keep both in
 * sync if either changes. Behaviour:<br>
 * <br>
 * - `[section-name]` starts a section; everything until the next
 *   `[section]` line belongs to it.<br>
 * - `key = value` sets an attribute (spaces around `=` optional).<br>
 * - Section/attribute names are lowercased, de-spaced, and stripped down to
 *   `[-a-zA-Z0-9_$]` (section names additionally keep `:`).<br>
 * - The original, un-normalised section name is kept on the section object
 *   as `__rawSectionName`.<br>
 * - A value wrapped in matching straight or curly quotes (`"..."`, `'...'`)
 *   has the quotes stripped; internal spaces are preserved.<br>
 * - Duplicate section or attribute names are suffixed `_2`, `_3`, etc.<br>
 * - A line starting with `#` is a comment. Any other line that isn't a
 *   `[section]` or `key = value` line (including one starting with `;`) is
 *   silently ignored - it never reaches a `=`, so nothing is stored.<br>
 *
 * @function readINI
 * @memberOf crdtuxpPHXS
 *
 * @param {string} text - raw text, which might or might not contain some
 *   INI-formatted data mixed with normal text
 * @returns {object} the parsed INI data, or `undefined` if `text` is empty/
 *   not a string, or contains no recognisable `[section]`
 */

function readINI(text) {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            if (! text || "string" != typeof text) {
                break;
            }

            let scanText = text + "\r";
            let state = STATE_IDLE;
            let attr;
            let value;
            let attrSpaceCount;
            let rawSectionName = "";
            let sectionName = "";
            let section;
            let attrCounters = {};
            let sectionCounters = {};

            for (let idx = 0; state != STATE_ERROR && idx < scanText.length; idx++) {
                let c = scanText.charAt(idx);
                switch (state) {
                    default:
                        crdtuxp.logError(arguments, "unexpected state");
                        state = STATE_ERROR;
                        break;
                    case STATE_IDLE:
                        if (c == '[') {
                            state = STATE_SEEN_OPEN_SQUARE_BRACKET;
                            rawSectionName = "";
                        }
                        else if (c == '#') {
                            state = STATE_IN_COMMENT;
                        }
                        else if (c > ' ') {
                            attr = c;
                            attrSpaceCount = 0;
                            state = STATE_SEEN_NON_WHITE;
                        }
                        break;
                    case STATE_IN_COMMENT:
                    case STATE_SEEN_CLOSE_SQUARE_BRACKET:
                        if (c == '\r' || c == '\n') {
                            state = STATE_IDLE;
                        }
                        break;
                    case STATE_SEEN_OPEN_SQUARE_BRACKET:
                        if (c == ']') {
                            state = STATE_SEEN_CLOSE_SQUARE_BRACKET;
                            sectionName = rawSectionName.toLowerCase();
                            sectionName = sectionName.replace(REGEXP_DESPACE, REGEXP_DESPACE_REPLACE);
                            sectionName = sectionName.replace(REGEXP_SECTION_NAME_ONLY, REGEXP_SECTION_NAME_ONLY_REPLACE);
                            if (sectionName) {

                                if (! retVal) {
                                    retVal = {};
                                }

                                let sectionSuffix = "";
                                let sectionCounter = 1;
                                if (sectionName in sectionCounters) {
                                    sectionCounter = sectionCounters[sectionName];
                                    sectionCounter++;
                                    sectionSuffix = "_" + sectionCounter;
                                }
                                sectionCounters[sectionName] = sectionCounter;
                                sectionName += sectionSuffix;
                                retVal[sectionName] = {};
                                section = retVal[sectionName];
                                section.__rawSectionName = rawSectionName;
                                attrCounters = {};
                            }
                        }
                        else {
                            rawSectionName += c;
                        }
                        break;
                    case STATE_SEEN_NON_WHITE:
                        if (c == "=") {
                            value = "";
                            state = STATE_SEEN_EQUAL;
                        }
                        else if (c == '\r' || c == '\n') {
                            state = STATE_IDLE;
                        }
                        else if (c != " ") {
                            while (attrSpaceCount > 0) {
                                attr += " ";
                                attrSpaceCount--;
                            }
                            attr += c;
                        }
                        else {
                            attrSpaceCount++;
                        }
                        break;
                    case STATE_SEEN_EQUAL:
                        if (c != '\r' && c != '\n') {
                            value += c;
                        }
                        else {
                            value = value.replace(REGEXP_TRIM, REGEXP_TRIM_REPLACE);
                            if (value.length >= 2) {
                                let firstChar = value.charAt(0);
                                let lastChar = value.charAt(value.length - 1);
                                if (
                                    (firstChar == "\"" || firstChar == "“" || firstChar == "”")
                                &&
                                    (lastChar == "\"" || lastChar == "“" || lastChar == "”")
                                ) {
                                    value = value.substring(1, value.length - 1);
                                }
                                else if (
                                    (firstChar == "'" || firstChar == "‘" || firstChar == "’")
                                &&
                                    (lastChar == "'" || lastChar == "‘" || lastChar == "’")
                                ) {
                                    value = value.substring(1, value.length - 1);
                                }
                            }

                            if (section) {
                                attr = attr.replace(REGEXP_DESPACE, REGEXP_DESPACE_REPLACE).toLowerCase();
                                attr = attr.replace(REGEXP_ALPHA_ONLY, REGEXP_ALPHA_ONLY_REPLACE);
                                if (attr) {

                                    let attrSuffix = "";
                                    let attrCounter = 1;
                                    if (attr in attrCounters) {
                                        attrCounter = attrCounters[attr];
                                        attrCounter++;
                                        attrSuffix = "_" + attrCounter;
                                    }
                                    attrCounters[attr] = attrCounter;
                                    attr += attrSuffix;

                                    section[attr] = value;
                                }
                            }

                            state = STATE_IDLE;
                        }
                        break;
                }
            }
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.readINI = readINI;

/**
 * Parse a `#RRGGBB` or `RRGGBB` hex color string (leading `#` optional).
 *
 * @function parseHexColor
 * @memberOf crdtuxpPHXS
 *
 * @param {string} hexString - e.g. `"#AACCFF"` or `"AACCFF"`
 * @returns {object} `{ r, g, b }` as integers 0-255, or `undefined` if
 *   `hexString` is not a valid 6-digit hex color
 */

function parseHexColor(hexString) {
// coderstate: function
    let retVal = undefined;

    do {
        try {
            if (! hexString || "string" != typeof hexString) {
                break;
            }

            let match = hexString.match(REGEXP_HEX_COLOR);
            if (! match) {
                break;
            }

            let hex = match[1];
            retVal = {
                r: parseInt(hex.substring(0, 2), 16),
                g: parseInt(hex.substring(2, 4), 16),
                b: parseInt(hex.substring(4, 6), 16)
            };
        }
        catch (err) {
            crdtuxp.logError(arguments, "throws " + err);
        }
    }
    while (false);

    return retVal;
}
crdtuxpPHXS.parseHexColor = parseHexColor;
