// Source: SSA, Period Life Table 2023, 2026 Trustees Report.
// https://www.ssa.gov/OACT/STATS/table4c6.html — accessed 2026-09-08.
// Columns: age, male remaining years, female remaining years. Public US government data.
export const table = [
[18,58.56,63.69],[19,57.62,62.72],[20,56.69,61.74],[21,55.76,60.77],[22,54.83,59.80],[23,53.90,58.83],[24,52.98,57.86],[25,52.06,56.90],[26,51.14,55.93],[27,50.23,54.97],[28,49.32,54.00],[29,48.41,53.04],[30,47.50,52.08],[31,46.60,51.13],[32,45.70,50.18],[33,44.81,49.23],[34,43.91,48.28],[35,43.02,47.34],[36,42.13,46.39],[37,41.24,45.45],[38,40.36,44.51],[39,39.47,43.58],[40,38.59,42.64],[41,37.71,41.71],[42,36.83,40.78],[43,35.95,39.86],[44,35.08,38.93],[45,34.21,38.01],[46,33.34,37.10],[47,32.48,36.18],[48,31.62,35.27],[49,30.76,34.36],[50,29.90,33.45],[51,29.05,32.55],[52,28.21,31.66],[53,27.38,30.77],[54,26.55,29.89],[55,25.73,29.01],[56,24.92,28.14],[57,24.12,27.28],[58,23.34,26.42],[59,22.56,25.57],[60,21.79,24.73],[61,21.04,23.90],[62,20.29,23.08],[63,19.56,22.27],[64,18.83,21.46],[65,18.12,20.66],[66,17.41,19.87],[67,16.71,19.08],[68,16.02,18.30],[69,15.34,17.53],[70,14.66,16.76],[71,14.00,16.01],[72,13.34,15.26],[73,12.69,14.53],[74,12.05,13.81],[75,11.42,13.10],[76,10.80,12.41],[77,10.19,11.73],[78,9.61,11.08],[79,9.04,10.44],[80,8.50,9.82],[81,7.97,9.22],[82,7.46,8.64],[83,6.97,8.08],[84,6.50,7.54],[85,6.04,7.02],[86,5.61,6.53],[87,5.20,6.05],[88,4.81,5.61],[89,4.45,5.19],[90,4.11,4.80],[91,3.80,4.44],[92,3.50,4.10],[93,3.23,3.79],[94,2.99,3.50],[95,2.77,3.23],[96,2.58,2.99],[97,2.41,2.77],[98,2.27,2.57],[99,2.15,2.39],[100,2.04,2.23]
];
export function estimate(birthDate,basis='average',asOf=new Date()){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(birthDate||''))throw new Error('A complete birth date was not supplied in your authorized record. No date can be generated.');
 const dob=new Date(birthDate+'T00:00:00Z');if(!Number.isFinite(dob.getTime())||dob.toISOString().slice(0,10)!==birthDate)throw new Error('The source birth date is invalid.');
 const today=new Date(asOf.toISOString().slice(0,10)+'T00:00:00Z');if(dob>today)throw new Error('The source birth date is in the future.');
 let age=today.getUTCFullYear()-dob.getUTCFullYear();if(today.getUTCMonth()<dob.getUTCMonth()||(today.getUTCMonth()===dob.getUTCMonth()&&today.getUTCDate()<dob.getUTCDate()))age--;
 if(age<18||age>100)throw new Error('This entertainment experience supports adults aged 18–100 only.');
 const row=table.find(r=>r[0]===age);if(!['average','male','female'].includes(basis))throw new Error('Choose a supported population reference.');
 const remaining=basis==='male'?row[1]:basis==='female'?row[2]:(row[1]+row[2])/2;
 const date=new Date(today.getTime()+Math.round(remaining*365.2425)*86400000).toISOString().slice(0,10);
 return {age,remaining,date,basis,asOf:today.toISOString().slice(0,10)};
}
