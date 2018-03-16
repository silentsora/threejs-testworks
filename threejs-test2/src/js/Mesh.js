export default class Mesh {
    constructor () {
        this.width = 0;
        this.height = 0;
        this.depth = 0;
        this.mesh = null;
        this.mergeNum = 10;
    }

    creatMesh () {
        const mergedGeometry = new THREE.Geometry();

        for (let i = 0; i < this.mergeNum; i++) {
            this.width = Math.random() * 0.2 + 0.1;
            this.height = Math.random() * 0.2 + 0.1;
            this.depth = Math.random() * 0.2 + 0.1;
            let geometry = new THREE.CubeGeometry(this.width, this.height, this.depth);

            const randomTransform = new THREE.Matrix4().makeTranslation(
                2 * Math.random() - 1,
                2 * Math.random() - 1,
                2 * Math.random() - 1);
            geometry.applyMatrix(randomTransform);
            mergedGeometry.merge(geometry);
        }

        const material = new THREE.MeshLambertMaterial({
            opacity: 0.7,
            transparent: true
        });
        const mesh = new THREE.Mesh(mergedGeometry, material);
        this.mesh = mesh;
        this.mesh.receiveShadow = true;
        this.mesh.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);

        return this.mesh;
    }

    update (range) {
        const positionRange = range || 5;
        // let widthScale = (Math.random() * 0.5 + 0.2) / this.width;
        // let heightScale = (Math.random() * 0.5 + 0.2) / this.height;
        // let depthScale = (Math.random() * 0.5 + 0.2) / this.depth;

        // this.mesh.scale.set(widthScale, heightScale, depthScale);
        this.mesh.position.set((Math.random() - 0.5) * positionRange, (Math.random() - 0.5) * positionRange, (Math.random() - 0.5) * positionRange);
    }
}
