fetch('data.json')
  .then(response => response.json())
  .then(dataDummy => {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dataDummy.labels,
        datasets: [{
          label: 'Visitas Mensuales',
          data: dataDummy.values,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  })
  .catch(error => console.error('Error cargando datos JSON:', error));
