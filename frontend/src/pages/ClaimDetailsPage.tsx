import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchFlaggedById } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/common/Skeleton';
import { ArrowLeft, ExternalLink, Shield } from 'lucide-react';

export default function ClaimDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['flagged', id],
    queryFn: () => fetchFlaggedById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64" /></div>;
  if (!data) return <p className="text-gray-500">Claim not found.</p>;

  const verdictVariant = data.verdict === 'FALSE' ? 'false' as const : data.verdict === 'SUSPICIOUS' ? 'suspicious' as const : data.verdict === 'TRUE' ? 'true' as const : 'unverifiable' as const;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Claim Details</CardTitle>
              <Badge variant={verdictVariant} className="text-sm px-3 py-1">{data.verdict}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-200 leading-relaxed">{data.text || data.id}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Detail label="Truth Score" value={data.truthScore.toFixed(4)} />
                <Detail label="Confidence" value={data.confidence.toFixed(4)} />
                <Detail label="Platform" value={data.platform || 'Unknown'} />
                <Detail label="Flagged At" value={new Date(data.flaggedAt).toLocaleString()} />
                <Detail label="Author" value={data.author || 'Unknown'} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>AI Explanation</CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-lg bg-gray-800/50 p-4 text-sm text-gray-300 leading-relaxed">
                {data.verdict === 'FALSE' && (
                  <p>Claim flagged as <span className="text-red-400 font-semibold">FALSE</span> because multiple authoritative sources contradict the statement. Contradiction score: {(1 - data.truthScore).toFixed(2)}.</p>
                )}
                {data.verdict === 'SUSPICIOUS' && (
                  <p>Claim flagged as <span className="text-yellow-400 font-semibold">SUSPICIOUS</span> due to insufficient corroborating evidence and moderate contradiction signals from fact-check databases.</p>
                )}
                {data.verdict === 'TRUE' && (
                  <p>Claim verified as <span className="text-green-400 font-semibold">TRUE</span> with high confidence. Multiple sources confirm the statement with strong entailment scores.</p>
                )}
                {data.verdict === 'UNVERIFIABLE' && (
                  <p>Claim marked as <span className="text-gray-400 font-semibold">UNVERIFIABLE</span> due to lack of sufficient evidence or conflicting information sources.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Evidence Sources</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Evidence source="Wikipedia" url="#" score={0.85} match />
                <Evidence source="Google Fact Check" url="#" score={0.72} match />
                <Evidence source="PostgreSQL" url="#" score={0.91} match />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Verification Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <TimelineStep label="Claim Extracted" time={new Date(data.flaggedAt).toLocaleTimeString()} />
                <TimelineStep label="Evidence Retrieved" time={new Date(data.flaggedAt).toLocaleTimeString()} />
                <TimelineStep label="ML Verification" time={new Date(data.flaggedAt).toLocaleTimeString()} />
                <TimelineStep label="Flagged" time={new Date(data.flaggedAt).toLocaleTimeString()} active />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><span className="text-gray-500">{label}</span><p className="text-gray-200 font-medium">{value}</p></div>;
}

function Evidence({ source, url, score, match }: { source: string; url: string; score: number; match: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-800/50 p-3">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-violet-400" />
        <span className="text-sm text-gray-200">{source}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">{score.toFixed(2)}</span>
        <a href={url} className="text-violet-400 hover:text-violet-300"><ExternalLink className="h-3 w-3" /></a>
      </div>
    </div>
  );
}

function TimelineStep({ label, time, active }: { label: string; time: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-2 w-2 rounded-full ${active ? 'bg-violet-500' : 'bg-gray-600'}`} />
      <span className={`flex-1 ${active ? 'text-gray-200' : 'text-gray-500'}`}>{label}</span>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
}
