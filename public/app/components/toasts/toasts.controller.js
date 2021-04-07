export class ToastsController {
    constructor(render, template) {
        this.render = render;
        this.template = template;
    }

    update(state) {
        this.template.update(this.render, state);
    }
}
