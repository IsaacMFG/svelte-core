export default (node: HTMLElement, properties: Object) => {
    const setProperties = () => {
        const keys = Object.keys(properties);
        for (let i = 0; i < keys.length; i++) {
            // Only set if it is not falsy.
            if (!properties[keys[i]]) continue;
            node.style.setProperty(`--${keys[i]}`, properties[keys[i]]);
        }
    };
    setProperties();

    return {
        update(newProperties) {
            properties = newProperties;
            setProperties();
        },
    };
};
