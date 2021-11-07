db.acoes.aggregate(
  [
    {
      $unwind: "$eventos"
    }, 
    {
      $unwind: "$eventos.publicacoes.localizacao.municipio"
    },
    {
      $project: 
      {
        _id: "$_id",
        nome: "$nome",
        municipio: "$eventos.publicacoes.localizacao.municipio",
        ano: {
          $year: "$eventos.publicacoes.lancamento"
        },
        mes: {
          $month: "$eventos.publicacoes.lancamento"
        }
      }
    },
    {
      $group:
      {
        _id: "$ano",
        mes: {
          $push: "$mes"
        },
        nome: 
        {
            $first: "$nome"
        },
        qtd: 
        {
          $sum: 1 
        },
        regioes: 
        {
          $push: "$municipio"
        }
      }
    }
  ])
