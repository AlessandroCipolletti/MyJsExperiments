window.addEventListener('load', init)

const initWasm = async() => {
  // // const a = await fetch('./optimized.wasm', {
  // const a = await fetch('http://drawith.me/optimized.wasm', { mode: 'no-cors' })
  // console.log({a})
  // const b = await a.arrayBuffer()
  // console.log({b})
  // const c = await WebAssembly.instantiate(b)
  // console.log({c})


  // const a = await fetch('http://drawith.me/optimized.wasm', { mode: 'no-cors' })
  // const b = await a.text()
  //
  // const importObject = {
  //   imports: { imported_func: arg => console.log(arg) }
  // }
  // WebAssembly.instantiateStreaming(fetch('./optimized.wasm', { mode: 'no-cors' }), importObject)
  // .then(results => {
  //   console.log({results})
  // })


  // const fetchPromise = fetch('./optimized.wasm', { mode: 'no-cors' })
  // const { instance } = await WebAssembly.instantiateStreaming(fetchPromise)
  // const result = instance.exports.add(42, 42)
  // console.log(result)

  const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 })
  const response = await fetch('./optimized.wasm', { mode: 'no-cors' })
  const importObject = {
    imports: { imported_func: arg => console.log(arg) },
    env: {
        abortStackOverflow: () => { throw new Error('overflow'); },
        table: new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }),
        tableBase: 0,
        memory,
        memoryBase: 1024,
        STACKTOP: 0,
        STACK_MAX: memory.buffer.byteLength,
    },
  }

  const buffer = await response.arrayBuffer()
  const obj = await WebAssembly.instantiate(buffer, importObject)
  console.log(obj.instance.exports.add(1, 2))



  // fetch('simple.wasm').then(response =>
  //   response.arrayBuffer()
  // ).then(bytes =>
  //   WebAssembly.instantiate(bytes, importObject)
  // ).then(results => {
  //   results.instance.exports.exported_func();
  // });


}

function init() {
  initWasm()
}
