import AllComponents from './components';
import Components from './components/Components';
import Templates from './templates/Templates';
import Formio from './Formio';
Components.setComponents(AllComponents);
Formio.Components = Components;
Formio.Templates = Templates;
const registerPlugin = (plugin) => {
  // Sanity check.
  if (typeof plugin !== 'object') {
    return;
  }
  // We need to set the base first as templates are overrides.
  if (plugin.hasOwnProperty('framework')) {
    Templates.framework = plugin.framework;
  }
  for (const key of Object.keys(plugin)) {
    switch (key) {
      case 'templates':
        for (const framework of Object.keys(plugin.templates)) {
          Templates.extendTemplate(framework, plugin.templates[framework]);
        }
        if (plugin.templates[Templates.framework]) {
          Templates.current = plugin.templates[Templates.framework];
        }
        break;
      case 'components':
        Components.setComponents(plugin.components);
        break;
      case 'framework':
        // Already above handled so ignore.
        break;
      case 'fetch':
        for (const name of Object.keys(plugin.fetch)) {
          Formio.registerPlugin(plugin.fetch[name], name);
        }
        break;
      case 'providers':
        // TODO: Implement custom providers
        break;
      default:
        console.log('Unknown plugin option', key);
    }
  }
};
/**
 * Allows passing in plugins as multiple arguments or an array of plugins.
 *
 * Formio.plugins(plugin1, plugin2, etc);
 * Formio.plugins([plugin1, plugin2, etc]);
 */
Formio.use = (...plugins) => {
  plugins.forEach((plugin) => {
    if (Array.isArray(plugin)) {
      plugin.forEach(p => registerPlugin(p));
    }
    else {
      registerPlugin(plugin);
    }
  });
};
export Form from './Form';
export Utils from './utils';
export { Components, Templates, Formio };

