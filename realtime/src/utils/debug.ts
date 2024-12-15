export default function debug(...args: any[]) {
  if(process.env.MODE === 'development') {
    console.log(...args)
  }
}