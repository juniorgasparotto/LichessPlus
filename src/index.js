const urlParams = new URLSearchParams(window.location.search);
const teamName = urlParams.get('teamName');

var elmTeamName = document.getElementById("labelTeamName");
var elmDates = document.getElementById("dates");
var elmTable = document.getElementById("wrapper");

elmDates.style.display = 'none';
elmTeamName.innerText = teamName;

if (self.fetch) {
  const url = "https://lichess.org/api/team/{teamId}/arena?max=1000".replace("{teamId}", teamName);

  fetch(url)
    .then(resp => {
      response = resp;
      return response.text();
    }).then(responseBody => {
      if (!response.ok) {
        throw responseBody;
      }
      return responseBody;
    })
    .then(ndjson => {
      var tournaments = new Array();
      const jsonArray = ndjson.split("\n");

      jsonArray.forEach(element => {
        if (element.trim()) {
          var torn = JSON.parse(element);
          if (torn.winner) {
            tournaments.push(torn);
          }
        }
      });

      var winners = Object.values(tournaments.groupBy((item) => item.winner.id)).map(f => [f[0].winner.id, f.length]);
      winners.sort(function (a, b) {
        return a[1] > b[1] ? -1 : 0;
      });

      // Exibir tabela
      elmTable.innerText = "";
      new gridjs.Grid({
        columns: ["Login", "Torneios vencidos"],
        data: winners
      }).render(elmTable);

      // Exibir data
      const options = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      };
      
      document.getElementById("labelDateFrom").innerText = "De: " + new Date(tournaments.last().startsAt).toLocaleDateString('pt-BR', options);
      document.getElementById("labelDateTo").innerText = "Até: " + new Date().toLocaleDateString('pt-BR', options);
      elmDates.style.display = 'block';
    })
    .catch(error => console.error(error));
} else {
  alert("Oops, ocorreu um erro ao tentar carregar as informações");
}