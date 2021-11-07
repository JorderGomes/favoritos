db.acoes.aggregate(
  [
    {
      $unwind: "$eventos"
    }, 
    {
      $project: 
      {
        _id: "$_id",
        nome: "$nome",
        municipio: "$eventos.educacaoAmbiental.municipio",
        ano: {
          $year: "$eventos.educacaoAmbiental.dataInauguracao"
        },
        mes: {
          $month: "$eventos.educacaoAmbiental.dataInauguracao"
        }
      }
    },
    {
      $group:
      {
        _id: "$mes",
        qtd: 
        {
          $sum: 1 
        },
        regioes: 
        {
          $push: "$municipio"
        },
        mes: {
          $last: "$mes"
        },
        ano: {
          $last: "$ano"
        }
      }
    }
  ])
