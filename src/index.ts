import { Application } from 'typedoc';
import { PluginHost } from 'typedoc/dist/lib/utils';
import { ExtrasPlugin } from './plugin';
import { copyFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { RendererEvent } from 'typedoc/dist/lib/output/events';

export function load(host: PluginHost) {
    const app: Application = host.application;

    // app.options.addDeclaration({
    //     name: 'plugin-option',
    //     help: 'Displayed when --help is passed',
    //     type: ParameterType.String,
    //     defaultValue: ''
    // });

    const workingDir = process.cwd();
    const outDir = app.options.getValue('out') || './docs';
    const icon = 'favicon.ico';

    const from = join(workingDir, icon);
    const to = join(workingDir, outDir, icon);

    if (existsSync(to)) {
        unlinkSync(to);
    }

    app.renderer.addComponent('extras', new ExtrasPlugin(app.renderer));
    app.renderer.once(RendererEvent.END, () => copyFileSync(from, to));
}