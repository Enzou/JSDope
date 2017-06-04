class Context {
    async loadTools() {
        try {
            this.tools = await Context.makeRequest('/tools');
            return true;
        } catch(e) {
            console.error("Couldn't load tools");
            return false;
        }
    }


}
