export class HeaderService {
    static async getStatus() {
        return workway("node://status.js");
    }
}
