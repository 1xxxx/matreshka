import initMK from '../_core/init';
import matreshkaError from '../_helpers/matreshkaerror';
import defineProp from '../_core/defineprop';
import set from '../set';

// returns an array of keys listed at inObject but not listed at fromObject
function getNotListedKeys(inObject, fromObject) {
    const result = [];
    nofn.forOwn(inObject, (_, key) => {
        if (!(key in fromObject)) {
            result.push(key);
        }
    });

    return result;
}

// changes property value and adds given key to a list of data keys
export default function setData(key, value, eventOptions) {

    // if no key or falsy key is given
    if (!key) {
        return this;
    }

    const { keys } = initMK(this);

    // allow to pass key-value object
    if (typeof key === 'object') {
        eventOptions = value || {};

        const { replaceData } = eventOptions;

        // do not call setData recursivally for better performance
        nofn.forOwn(key, (objVal, objKey) => {
            // remove data keys not listed at key-value object
            if (replaceData) {
                const notListedKeys = getNotListedKeys(keys, key);

                if (notListedKeys.length) {
                    this.removeDataKeys(notListedKeys);
                }
            }

            // define descriptors for given property
            defineProp(this, objKey);

            // add a key to a list of keys
            keys[objKey] = 1;

            // do other things with set method
            // value arg means "eventOptions"
            set(this, objKey, objVal, eventOptions);
        });

        return this;
    }

    eventOptions = eventOptions || {};

    const { replaceData } = eventOptions;

    // remove all data keys except given key
    if (replaceData) {
        const notListedKeys = getNotListedKeys(keys, { [key]: true });

        if (notListedKeys.length) {
            this.removeDataKeys(notListedKeys);
        }
    }

    // define descriptors for given property
    defineProp(this, key);

    // add a key to a list of keys
    keys[key] = 1;

    // do other things with set method
    return set(this, key, value, eventOptions);
}
