db.acoes.aggregate(
  [
    {
      $unwind: "$eventos"
    }, 
    {
      $unwind: "$eventos.publicacoes"
    },
    {
      $project: 
      {
        _id: "$_id",
        idIniciativa: "$eventos._id",
        nome: "$nome",
        categoria: "$categoria",
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
        _id: {
          idIniciativa: "$idIniciativa",
          nome: "$nome",
          categoria: "$categoria",
          ano: "$ano",
          mes: "$mes"
        },
        qtd: 
        {
          $sum: 1 
        },
        regioes: 
        {
          $addToSet: "$municipio"
        },
      }
    },
    {
      $project: 
      {
        _id: "$_id.mes",
        iniciativaRes:
        {
          idIniciativa: "$_id.idIniciativa",
          nome: "$_id.nome",
          categoria: "$_id.categoria",
          qtd: "$qtd",
          regioes: "$regioes"
        },
        ano: "$_id.ano"
      }
    },
    {
      $group: 
      {
        _id: {
          mes: "$_id",
          ano: "$ano"
        },
        iniciativaRes:
        {
          $addToSet: "$iniciativaRes"
        }
      }
    },
    {
      $project: 
      {
        _id: "$_id.ano",
        meses: 
        {
          mes: "$_id.mes",
          iniciativaRes: "$iniciativaRes"
        }
      }
    },
    {
      $group: 
      {
        _id: "$_id",
        meses:
        {
          $addToSet: "$meses"
        }
      }
    },
])
