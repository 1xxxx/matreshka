import defs from '../../_core/defs';
import matreshkaError from '../../_helpers/matreshkaerror';

// checks is item already rendered in an array
// selfDef is given instead of itself (array) for perf optimisation
export default function checkAlreadyRendered({
    item,
    selfDef
}) {
    const itemDef = defs.get(item);
    const { id: selfId } = selfDef;

    // if item object is defined in object defs
    if (itemDef) {
        const { renderedInArrays } = itemDef;

        // if item's node is already rendered for an array
        // then throw an error
        if (renderedInArrays && renderedInArrays[selfId]) {
            throw matreshkaError('array:add_render_twice');
        }
    }
}
