export class AppTemplate {
    static update(render) {
        /* eslint-disable indent */
        return render`
            <header></header>

            <div class="flex flex-wrap-s flex-wrap-m ma2 pa2">
                <div class="flex flex-wrap flex-column min-w-70">
                    <basket></basket>
                    <assets></assets>
                    <most-used></most-used>
                    <latest></latest>
                    <other></other>
                </div>
                <div class="flex flex-wrap flex-column min-w-30">
                    <stats></stats>
                </div>
            </div>
        `;
        /* eslint-enable indent */
    }
}
