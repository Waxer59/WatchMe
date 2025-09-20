FROM golang:1.25.1-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o /app/main .

FROM alpine:3.22.1

WORKDIR /app

COPY --from=builder /app/main .

ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["./main"]