
/**
 * @class qrenderer.geometric.GeoPoint
 * 
 * 
 *  
 * 几何学意义上的点，它不可见，没有大小，用来进行数学运算。
 * 
 * @author 大漠穷秋 <damoqiongqiu@126.com>
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
export default class GeoPoint{
    /**
     * @constructor GeoPoint
     * @param {*} x 
     * @param {*} y 
     */
    constructor(x=0,y=0){
        this.x = x;
        this.y = y;
    }

    /**
     * Creates a {GeoPoint} out of JSON parsed object
     * @param {JSONObject} o the JSON parsed object
     * @return {GeoPoint} a newly constructed GeoPoint
     */
    static load(o){
        return new GeoPoint(Number(o.x), Number(o.y));
    }


    /**
     * Creates an array of points from an array of {JSONObject}s
     * @param {Array} v the array of JSONObjects
     * @return an {Array} of {GeoPoint}s
     */
    static loadArray(v){
        let newPoints = [];
        for(let i=0; i< v.length; i++){
            newPoints.push(GeoPoint.load(v[i]));
        }
        return newPoints;
    }


    /**
     * Clones an array of points
     * @param {Array} v - the array of {GeoPoint}s
     * @return an {Array} of {GeoPoint}s
     */
    static cloneArray(v){
        let newPoints = [];
        for(let i=0; i< v.length; i++){
            newPoints.push(v[i].clone());
        }
        return newPoints;
    }

    transform(matrix){
        let oldX = this.x;
        let oldY = this.y;
        this.x = matrix[0][0] * oldX + matrix[0][1] * oldY + matrix[0][2];
        this.y = matrix[1][0] * oldX + matrix[1][1] * oldY + matrix[1][2];
    }

    /**
     * Tests if this point is similar to other point
     * @param {GeoPoint} anotherPoint - the other point
     */
    equals(anotherPoint){
        return (this.x == anotherPoint.x) && (this.y == anotherPoint.y)
    }

    /**
     * Clone current GeoPoint
     */
    clone(){
        let newPoint = new GeoPoint(this.x, this.y);
        return newPoint;
    }

    add(point) {
        this.x = this.x + point.x;
        this.y = this.y + point.y;
        return this;
    }

    /**
     * Tests to see if a point (x, y) is within a range of current GeoPoint
     * @param {Numeric} x - the x coordinate of tested point
     * @param {Numeric} y - the x coordinate of tested point
     * @param {Numeric} radius - the radius of the vicinity
     */
    near(x, y, radius){
        let distance = Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
        return (distance <= radius);
    }

    toString(){
        return '[' + this.x + ',' + this.y + ']';
    }
}