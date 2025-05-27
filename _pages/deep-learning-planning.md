---
title: "1. 기획 & 데이터 설계"
layout: single
sidebar:
  nav: main
permalink: /projects/deep-learning/planning/
author_profile: true
entries_layout: list
category: planning
toc: true
toc_label: "Contents"
---


## 🎯 프로젝트 선정 배경

이번 스터디의 5월 프로젝트 주제로 **딥러닝 기반 이미지 처리**를 선정하였다.  
그 이유는 다음과 같다.

- 팀원 다수가 이미지 처리 경험을 보유하고 있어 **기술 진입 장벽이 낮다**.  
- 단순 전처리를 넘어서, **결함 분류 및 탐지 알고리즘까지 확장 가능한 주제**가 필요했다.  
- 특히 **반도체 머신비전 분야**는 결함을 얼마나 빠르고 정확하게 탐지하느냐에 초점을 맞추기 때문에,  
  프로젝트의 **목표가 명확하고 집중도가 높다**.  
- 공개된 문서나 논문에 **정확도 및 처리 속도에 대한 기준 지표**가 명시되어 있어,  
  실제 실습 결과를 기반으로 **객관적인 성과 비교가 가능하다**.

이러한 요소들은 학습 목표와 실무 연계를 동시에 충족할 수 있는 조건이 되며,  
**딥러닝 데이터 설계 및 실험 환경 구성에 적합한 주제**로 판단하였다.



## 💡 프로젝트 개요

서론: 머신비전 → 반도체 검사, 자율주행에 활용됨

목표: 반도체 웨이퍼 표면검사에 쓰이는 이미지 처리 알고리즘을 연구

데이터: DAGM 2007 – 난이도가 낮다, 인공 생성된 유사 웨이퍼 이미지

---

## 🧭 문제 정의

이미지 처리 알고리즘은 난이도에 따라 세 분류로 나눌 수 있다. 

| 유형 | 설명 | 난이도 | 추천 기술 및 모델 |
| --- | --- | --- | --- |
| 🧠 분류 (Classification) | 이미지에 불량이 있는지 여부만 판단 | ★☆☆ | `ResNet`, `EfficientNet` |
| 📍 위치 검출 (Detection) | 이미지 내 불량의 위치와 경계 표시 | ★★☆ | `YOLOv5`,  `Faster R-CNN` |
| ⚠️ 이상 감지 (Anomaly Detection) | 정상이 아닌 패턴을 자동 식별
(라벨 없이 비지도 학습) | ★★★ | `AutoEncoder`, `GANomaly` |

## 📂 문제 정의에 따른 데이터 구성 방식의 차이

모델 구조가 다르면 라벨링 방식과 데이터 디렉토리 구조도 달라진다.

분류(Classification) 모델과 검출(Detection) 모델은 서로 다른 방식으로 데이터를 구성해야 한다.

모델 구조에 따라 데이터 구성 방식이 어떻게 달라지는지 궁금하다면  
➡️ [데이터 구성 가이드 포스트 보기](/planning/data-structure-guidelines/)

---

## 🦋 Augmentation의 필요성

<img src="/assets/images/2025/DLplanning/augmentation-sample.png" 
     alt="곤충 분류 예시 - Augmentation 샘플" 
     width="700"/>
     
<small>
출처: <a href="https://www.biorxiv.org/content/10.1101/2024.11.01.621497v1.full" target="_blank" rel="noopener noreferrer">
BioRxiv 논문: Augmentation for Insect Species Identification</a>
</small>

---

## 🦋 Augmentation의 필요성

모델 학습에 **Augmentation**이 필요한 이유를 설명하기 위한 예시로,  
카메라로 곤충을 인식하는 소프트웨어 **AInsectID**를 들겠다.

모델이 **호랑나비 사진 한 장만** 학습했다고 가정하자.  
하지만 실제 환경에서는 나비가 다음처럼 다양하게 등장할 수 있다:

- 나뭇잎 위에 비스듬히 앉아 있거나  
- 그늘진 곳에 있거나  
- 날개의 무늬나 색상이 다를 수 있다

이런 변화에 모델이 적응하지 못하면 인식이 실패할 수 있다.

이를 해결하는 방법이 바로 👉 **데이터 증강(Augmentation)**이다.  
회전, 색상 변화, 위치 이동 등으로 데이터를 다양하게 만들어 
모델이 다양한 상황에서도 잘 작동하도록 학습을 돕는다.

---

## 🧠 실무자의 관점에서 보는 전처리

전처리는 **사람과 모델의 관점이 다르다.**

사람은 **깔끔한 이미지**를 선호하지만,  
모델은 **불량의 수치적 특징이 뚜렷한 이미지**를 더 잘 학습한다.

예를 들어, 뿌연 이미지는 사람이 보기엔 불편하지만  
모델에게는 불량이 더 잘 드러날 수 있다.

따라서 전처리는 **사람 기준이 아닌 모델 기준**으로 수행해야 한다.

### 🔍 비교 표

| 분류           | 사람 기준       | 모델 기준               | 결론                         |
|----------------|----------------|--------------------------|------------------------------|
| **특징**        | 시각적 편안     | 수치적 인식              | ✅ 모델 기준으로 전처리함     |
| **뿌연 사진**   | 보기 불편       | 불량 특징이 더 두드러짐   | ✅ 모델 선호                  |
| **깔끔한 사진** | 보기 편함       | 특징이 사라짐             | ⚠️ 모델 비선호                |

<br>

### 🖼️ 예시 이미지

<img src="/assets/images/2025/DLplanning/example-blur.jpg" 
     alt="Blur Example" 
     width="700"/>
     
<small>
출처: <a href="https://www.manula.com/manuals/fxhome/imerge-pro/2021.5/en/topic/blurs" target="_blank" rel="noopener noreferrer">
FXHome Imerge Pro Manual - Blur Effects</a>
</small>


---

## 🧾 데이터셋 구성

- Train / Validation / Test 분할 비율을 정하고, 클래스 불균형 문제를 해결해야 한다.
- 교차 검증(K-fold) 전략을 사용할 경우, 데이터 누수(Data Leakage)를 방지할 수 있도록 주의한다.

**고려 포인트**
- 데이터셋 간 도메인 격차(domain drift)를 고려
- 불균형 데이터 처리: 샘플링, 클래스 가중치 등 활용
- 누수 방지: 이미지 중복 여부, 순서 기반 분할 방지

---

향후 "모델링 & 학습 평가", "배포 & 운영" 단계에서 이 기획 내용이 기반이 된다.  
기획 단계에서 탄탄한 구조를 세우는 것이 전체 프로젝트 완성도를 좌우한다.
