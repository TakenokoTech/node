export default stub;

import {Array1D, Array2D, CostReduction, NDArrayMathGPU, Scalar, Graph, InCPUMemoryShuffledInputProviderBuilder, Session, SGDOptimizer} from 'deeplearn';
import _ from 'underscore'
import $ from 'jquery'
import moment from 'moment'
import rate from "./rate.es6"

/** 文字描画
 * @param str
 */
const renderString = (str) => {
    $("#container").append(`<div>${str}</div>`)
}

/** 学習データの生成
 * @param learnDataSize 
 * @param fixDataSize 
 */
const createData = (learnDataSize = 99999, fixDataSize = 99999) => {
    let data = []
    for(let r of rate) {
        let date = _.size(data) + 1 // moment(r[0], "YYYYMMDD")
        let finish = r[1] - 0
        let start = r[2] - 0
        let max = r[3] - 0
        let min = r[4] - 0
        data.unshift([date, finish, start, max, min])
    }
    // data = _.shuffle(data)
    let [learndata, leftdata] = _.partition(data, (v, i) => i < learnDataSize)
    let [fixdata, ansdata] = _.partition(leftdata, (v, i) => i < fixDataSize)
    return [learndata, fixdata, ansdata]
}

/** 列抽出
 * @param array 
 * @param index 
 */
const pickRow = (array, index) => {
    return _.map(array, a => a[index])
}

/** グラフ
 */
const chart = (labels, data) => {
    new Chart(
        document.getElementById("chart"),
        {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "cost",
                    data: data,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    lineTension: 0.1
                }]
            },
            options:{} 
    });
}

/** メインシーケンス
 */
//async
function stub() {

    // initialize 
    const g = new Graph();
    const math = new NDArrayMathGPU();
    const session = new Session(g, math);
    const optimizer = new SGDOptimizer(1);

    // create data
    const data = createData(10, 100);
    const labels = _.map(pickRow(data[0], 0), a => Array1D.new([a]));
    const inputs = _.map(pickRow(data[0], 1), a => Array1D.new([a]));

    _.each(labels, (v, i) => console.log(i, labels[i].ndarrayData.values[0], inputs[i].ndarrayData.values[0]))
    chart( _.map(labels, v => v.ndarrayData.values[0]), _.map(inputs, v => v.ndarrayData.values[0]));

    const shuffledInputProviderBuilder = new InCPUMemoryShuffledInputProviderBuilder([inputs, labels]);
    const [inputProvider, labelProvider] = shuffledInputProviderBuilder.getInputProviders();
    // console.log(inputProvider, labelProvider)

    // create Tensor
    const labelTensor = g.placeholder('label', [1]);
    const inputTensor = g.placeholder('input', [1]);

    // h0 = input * w0 + b0
    const w0 = g.variable("w0", Array2D.randNormal([1, 1]));
    const b0 = g.variable("b0", Array2D.randNormal([1]));
    const a0 = g.add(g.matmul(inputTensor, w0), b0);
    const h0 = g.relu(a0);

    // h0 = input * w0 + b0
    const w1 = g.variable("w1", Array2D.randNormal([1, 1]));
    const b1 = g.variable("b1", Array2D.randNormal([1]));
    const a1 = g.add(g.matmul(h0, w1), b1);
    const h1 = g.relu(a1);

     // y = h0 * w1 + b1
    const w2 = g.variable("w1", Array2D.randNormal([1, 1]));
    const b2 = g.variable("b1", Array2D.randNormal([1]));
    const a2 = g.add(g.matmul(h1, w2), b2);
    const outputTensor = g.sigmoid(a2, [1]);

    renderString(`label = ${labelTensor.shape}`)
    renderString(`output = ${outputTensor.shape}`)
    renderString("------------------------------------------")

    // calc cost 
    const costTensor = g.meanSquaredCost(outputTensor, labelTensor);
    console.log(costTensor)
    
    let _label = []
    let _data = []
    for (let i = 0; i < 50; i++) {
        math.scope((keep, track) => {
            const cost = session.train(
                costTensor,
                [{tensor: inputTensor, data: inputProvider}, {tensor: labelTensor, data: labelProvider}],
                1,
                optimizer,
                CostReduction.MEAN
            )

            _label.push( i + 1 )
            _data.push(cost.get());
            renderString('ave cost (' + i + '): ' + cost.get());
           
        });
        //chart(_label, _data);
    }
}
