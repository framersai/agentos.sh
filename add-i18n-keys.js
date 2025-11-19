const fs = require('fs');

const translations = {
  ko: {
    codeExamples: {
      title: "AgentOS 실제 동작 보기",
      subtitle: "일반적인 패턴을 위한 프로덕션 준비 코드 예제",
      categories: { basic: "시작하기", advanced: "고급 패턴", integration: "통합", deployment: "배포" },
      examples: {
        basicAgent: { title: "첫 번째 에이전트 만들기", description: "메모리 및 도구를 사용한 기본 에이전트 설정" },
        gmiRoles: { title: "GMI 역할 및 에이전시", description: "일반화된 마인드 인스턴스 역할 구현" },
        memorySystem: { title: "고급 메모리 관리", description: "영구 및 컨텍스트 메모리 구현" },
        realtimeStream: { title: "실시간 스트리밍", description: "실시간 에이전트 응답을 위한 WebSocket 스트리밍" }
      },
      copyButton: "복사", copied: "복사됨!", runButton: "예제 실행", docsButton: "문서 보기"
    },
    gmiSection: {
      title: "GMI 아키텍처", subtitle: "창발적 지능을 위한 일반화된 마인드 인스턴스 오케스트레이션",
      agents: {
        researcher: { name: "연구원", description: "정보 발견 및 분석", persona: "호기심 많은, 정확한" },
        analyst: { name: "분석가", description: "데이터 처리 및 해석", persona: "회의적인, 체계적인" },
        creator: { name: "크리에이터", description: "콘텐츠 및 솔루션 생성", persona: "명확한, 설득력 있는" },
        executor: { name: "실행자", description: "행동 실행 및 구현", persona: "신뢰할 수 있는, 행동 지향적" },
        orchestrator: { name: "오케스트레이터", description: "다중 에이전트 작업 조정", persona: "균형 잡힌, 게이트키퍼" }
      },
      useCaseTitle: "실제 사용 사례", whatYouGetTitle: "제공 내용", architectureTitle: "시스템 아키텍처"
    },
    multiAgent: {
      title: "다중 에이전트 협업 패턴", subtitle: "함께 작업하는 전문 AI 에이전트 팀 오케스트레이션",
      modes: {
        consensus: { title: "합의 기반 협업", description: "가중치가 적용된 신뢰도 점수로 의사 결정에 투표하는 여러 에이전트" },
        sequential: { title: "순차 파이프라인", description: "결과를 전달하는 정렬된 단계에서 작업하는 에이전트" },
        parallel: { title: "병렬 처리", description: "다양한 측면에서 동시에 작업하는 독립 에이전트" }
      },
      workflow: "워크플로", duration: "기간", throughput: "처리량", useCases: "사용 사례",
      pros: "장점", cons: "고려사항", codeExample: "코드 예제"
    },
    ecosystem: {
      title: "생태계 및 통합", subtitle: "좋아하는 도구 및 서비스와 AgentOS 연결",
      categories: { llms: "언어 모델", memory: "메모리 및 저장소", tools: "도구 및 API", deployment: "배포" }
    },
    coordination: {
      title: "조정 패턴", subtitle: "복잡한 다중 에이전트 워크플로를 위한 디자인 패턴",
      patterns: { fanOut: "팬아웃 패턴", pipeline: "파이프라인 패턴", mapReduce: "맵리듀스 패턴", consensus: "합의 패턴" }
    },
    socialProof: {
      title: "전 세계 팀의 신뢰", subtitle: "AgentOS로 미래를 구축하는 수천 명의 개발자와 함께하세요",
      stats: { developers: "개발자", projects: "프로젝트", countries: "국가", stars: "GitHub 스타" }
    },
    videoDemo: {
      title: "AgentOS 실제 동작 보기", subtitle: "적응형 AI 에이전트 구축이 얼마나 쉬운지 확인하세요",
      watchButton: "데모 보기", duration: "시간"
    }
  },
  es: {
    codeExamples: {
      title: "Ver AgentOS en Acción", subtitle: "Ejemplos de código listos para producción para patrones comunes",
      categories: { basic: "Primeros Pasos", advanced: "Patrones Avanzados", integration: "Integraciones", deployment: "Despliegue" },
      examples: {
        basicAgent: { title: "Crea Tu Primer Agente", description: "Configuración básica de agente con memoria y herramientas" },
        gmiRoles: { title: "Roles GMI y Agencias", description: "Implementando roles de Instancia Mental Generalizada" },
        memorySystem: { title: "Gestión Avanzada de Memoria", description: "Implementando memoria persistente y contextual" },
        realtimeStream: { title: "Streaming en Tiempo Real", description: "Streaming WebSocket para respuestas de agentes en vivo" }
      },
      copyButton: "Copiar", copied: "¡Copiado!", runButton: "Ejecutar Ejemplo", docsButton: "Ver Docs"
    },
    gmiSection: {
      title: "Arquitectura GMI", subtitle: "Orquestación de Instancia Mental Generalizada para inteligencia emergente",
      agents: {
        researcher: { name: "Investigador", description: "Descubre y analiza información", persona: "curioso, preciso" },
        analyst: { name: "Analista", description: "Procesa e interpreta datos", persona: "escéptico, metódico" },
        creator: { name: "Creador", description: "Genera contenido y soluciones", persona: "claro, persuasivo" },
        executor: { name: "Ejecutor", description: "Toma acciones e implementa", persona: "confiable, orientado a la acción" },
        orchestrator: { name: "Orquestador", description: "Coordina tareas multiagente", persona: "equilibrado, guardián" }
      },
      useCaseTitle: "Casos de Uso Reales", whatYouGetTitle: "Lo Que Obtienes", architectureTitle: "Arquitectura del Sistema"
    },
    multiAgent: {
      title: "Patrones de Colaboración Multiagente", subtitle: "Orquesta equipos de agentes de IA especializados trabajando juntos",
      modes: {
        consensus: { title: "Colaboración Basada en Consenso", description: "Múltiples agentes votan sobre decisiones con puntuaciones de confianza ponderadas" },
        sequential: { title: "Pipeline Secuencial", description: "Los agentes trabajan en etapas ordenadas pasando resultados hacia adelante" },
        parallel: { title: "Procesamiento Paralelo", description: "Agentes independientes trabajan simultáneamente en diferentes aspectos" }
      },
      workflow: "Flujo de Trabajo", duration: "Duración", throughput: "Rendimiento", useCases: "Casos de Uso",
      pros: "Ventajas", cons: "Consideraciones", codeExample: "Ejemplo de Código"
    },
    ecosystem: {
      title: "Ecosistema e Integraciones", subtitle: "Conecta AgentOS con tus herramientas y servicios favoritos",
      categories: { llms: "Modelos de Lenguaje", memory: "Memoria y Almacenamiento", tools: "Herramientas y APIs", deployment: "Despliegue" }
    },
    coordination: {
      title: "Patrones de Coordinación", subtitle: "Patrones de diseño para flujos de trabajo multiagente complejos",
      patterns: { fanOut: "Patrón Fan-out", pipeline: "Patrón Pipeline", mapReduce: "Patrón Map-Reduce", consensus: "Patrón Consenso" }
    },
    socialProof: {
      title: "Confiado por Equipos en Todo el Mundo", subtitle: "Únete a miles de desarrolladores construyendo el futuro con AgentOS",
      stats: { developers: "Desarrolladores", projects: "Proyectos", countries: "Países", stars: "Estrellas GitHub" }
    },
    videoDemo: {
      title: "Ver AgentOS en Acción", subtitle: "Ve lo fácil que es construir agentes de IA adaptativos",
      watchButton: "Ver Demo", duration: "Duración"
    }
  },
  ja: {
    codeExamples: {
      title: "AgentOS の動作を見る", subtitle: "一般的なパターン向けの本番対応コード例",
      categories: { basic: "始める", advanced: "高度なパターン", integration: "統合", deployment: "デプロイ" },
      examples: {
        basicAgent: { title: "最初のエージェントを作成", description: "メモリとツールを使用した基本的なエージェント設定" },
        gmiRoles: { title: "GMI ロールとエージェンシー", description: "一般化マインドインスタンスロールの実装" },
        memorySystem: { title: "高度なメモリ管理", description: "永続的およびコンテキストメモリの実装" },
        realtimeStream: { title: "リアルタイムストリーミング", description: "ライブエージェント応答用の WebSocket ストリーミング" }
      },
      copyButton: "コピー", copied: "コピーしました！", runButton: "例を実行", docsButton: "ドキュメントを表示"
    },
    gmiSection: {
      title: "GMI アーキテクチャ", subtitle: "創発的知能のための一般化マインドインスタンスオーケストレーション",
      agents: {
        researcher: { name: "研究者", description: "情報を発見し分析", persona: "好奇心旺盛、正確" },
        analyst: { name: "アナリスト", description: "データを処理し解釈", persona: "懐疑的、体系的" },
        creator: { name: "クリエイター", description: "コンテンツとソリューションを生成", persona: "明確、説得力のある" },
        executor: { name: "エグゼキューター", description: "アクションを実行し実装", persona: "信頼できる、行動指向" },
        orchestrator: { name: "オーケストレーター", description: "マルチエージェントタスクを調整", persona: "バランスの取れた、ゲートキーパー" }
      },
      useCaseTitle: "実際の使用例", whatYouGetTitle: "得られるもの", architectureTitle: "システムアーキテクチャ"
    },
    multiAgent: {
      title: "マルチエージェント協調パターン", subtitle: "一緒に働く専門AIエージェントチームをオーケストレート",
      modes: {
        consensus: { title: "コンセンサスベースの協調", description: "重み付けされた信頼スコアで決定に投票する複数のエージェント" },
        sequential: { title: "順次パイプライン", description: "結果を前方に渡す順序付けられた段階で作業するエージェント" },
        parallel: { title: "並列処理", description: "異なる側面で同時に作業する独立したエージェント" }
      },
      workflow: "ワークフロー", duration: "期間", throughput: "スループット", useCases: "使用例",
      pros: "利点", cons: "考慮事項", codeExample: "コード例"
    },
    ecosystem: {
      title: "エコシステムと統合", subtitle: "お気に入りのツールとサービスに AgentOS を接続",
      categories: { llms: "言語モデル", memory: "メモリとストレージ", tools: "ツールと API", deployment: "デプロイ" }
    },
    coordination: {
      title: "調整パターン", subtitle: "複雑なマルチエージェントワークフローのデザインパターン",
      patterns: { fanOut: "ファンアウトパターン", pipeline: "パイプラインパターン", mapReduce: "マップリデュースパターン", consensus: "コンセンサスパターン" }
    },
    socialProof: {
      title: "世界中のチームに信頼されています", subtitle: "AgentOS で未来を構築する何千もの開発者に参加",
      stats: { developers: "開発者", projects: "プロジェクト", countries: "国", stars: "GitHub スター" }
    },
    videoDemo: {
      title: "AgentOS の動作を見る", subtitle: "適応型AIエージェントを構築する簡単さを確認",
      watchButton: "デモを見る", duration: "時間"
    }
  }
};

['ko', 'es', 'ja', 'de', 'fr', 'pt', 'zh'].forEach(locale => {
  const filePath = `messages/${locale}.json`;
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Add new sections if they don't exist
    if (!data.codeExamples && translations[locale]) {
      Object.assign(data, translations[locale]);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✓ Updated ${locale}.json with all new i18n keys`);
    } else {
      console.log(`✓ ${locale}.json already has keys or no translations available`);
    }
  } catch (err) {
    console.error(`✗ Error updating ${locale}:`, err.message);
  }
});

console.log('\n✓ All locale files processed!');

