// Parse data from source into chart-useable components
// Standard application: Array of objects

export const parseData = (data) => {

  // Console dataset to examine (comment out afterwards)
  // console.log(data);

  // Doping: string, Name: string, Nationality: string (iso 3166-1 alpha-3),
  // Place: number, Seconds: number, Time: string (converted string of Seconds)
  // URL: string (src for Doping), Year: number

  return data.map(d => {
    return {
      ...d,
      TimeMins: new Date(d.Seconds * 1000),
      // used string literal to force parsing the number year as year
      // alternative would be (d.Year, 0) to indicate YYYY jan 1, 00 etc.
      Year: new Date(`${d.Year}`),
      // Produce boolean true if doping alegations present in the Doping string
      dopingBool: (d.Doping) ? true : false
    }
  })
}