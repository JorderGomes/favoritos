   public LinhaDoTempo getLinhaDoTempo() {
//
       UnwindOperation unwindOperation = unwind("$eventos");
//
       IfNull condYear = this.datasRecursaoAnos(this.caminhosDatas);
//
       IfNull condMonth = this.datasRecursaoMeses(this.caminhosDatas);
//
       IfNull condReg = this.municipiosRecursao(this.caminhosMunicipios);
//
       ProjectionOperation projectionOperation = project( "nome", "categoria", "eventos")
               .and("_id").as("idIniciativa")
               .and(condYear).as("ano")
               .and(condMonth).as("mes")
               .and(condReg).as("regioes");
//
//
       GroupOperation groupOperation = group("idIniciativa", "ano", "mes", "regioes").count().as("qtd")
//               .addToSet (municipiosRecursao(this.caminhosMunicipios)).as("regioes")
               .first("nome").as("nome")
               .first("categoria").as("categoria")
               .first("idIniciativa").as("idIniciativa");
//
//
       ProjectionOperation projectionOperation1 = project("ano", "mes", "idIniciativa", "nome", "categoria", "qtd", "regioes")
//               .and(municipiosRecursao(this.caminhosMunicipios)).as("regioes")
               .and("iniciativa").nested(Fields.fields()
                       .and("idIniciativa", "idIniciativa")
                       .and("nome", "nome")
                       .and("categoria", "categoria")
                       .and("qtd", "qtd")
                       .and("regioes", "regioes"));
//
       GroupOperation groupOperation1 = group("ano", "mes")
               .addToSet("iniciativa").as("iniciativasRes");
//
       ProjectionOperation projectionOperation2 = project("ano", "mes", "iniciativasRes")
               .and("meses").nested(Fields.fields()
                       .and("mes", "mes")
                       .and("iniciativasRes", "iniciativasRes"));
//
       SortOperation sortOperation = sort(Sort.Direction.ASC, "ano").and(Sort.Direction.ASC, "mes");
//
       GroupOperation groupOperation2 = group("ano").push("meses").as("meses");
//
       ProjectionOperation projectionOperation3 = project("_id", "meses").and("_id").as("ano");
//
       Aggregation aggregation = newAggregation(
               unwindOperation,
               projectionOperation,
               groupOperation,
               projectionOperation1,
               groupOperation1,
               projectionOperation2,
               sortOperation,
               groupOperation2,
               projectionOperation3);
       AggregationResults<Tempo> tempos = mongoTemplate.aggregate(aggregation, "acoes", Tempo.class);
//
       return new LinhaDoTempo(tempos.getMappedResults());
   }