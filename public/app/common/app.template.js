export class AppTemplate {
    static update(render) {
        return render`
            <header></header>

            <div class="flex flex-wrap mx-16">
                <div class="flex flex-col md:w-8/12">
                    <basket></basket>
                    <assets></assets>
                    <most-used></most-used>
                    <latest></latest>
                    <other></other>
                </div>
                <div class="flex flex-col items-end md:w-4/12">
                    <stats></stats>
                </div>
            </div>
        `;
    }
}
